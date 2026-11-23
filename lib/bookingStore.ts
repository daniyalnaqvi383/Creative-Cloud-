import crypto from "crypto";
import { getDb } from "./db";

export interface Booking {
  _id: string;
  name: string;
  phone: string;
  email: string;
  socialHandle: string;
  meetingType: "zoom" | "phone";
  startTime: Date; // UTC
  endTime: Date;   // UTC
  clientTimezone: string;
  status: "confirmed" | "cancelled" | "completed";
  confirmationEmailSent: boolean;
  adminEmailSent: boolean;
  startEmailSent: boolean;
  adminReminderSent: boolean;
  startEmailClaimedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export type NewBookingInput = Omit<
  Booking,
  | "_id"
  | "status"
  | "confirmationEmailSent"
  | "adminEmailSent"
  | "startEmailSent"
  | "adminReminderSent"
  | "startEmailClaimedAt"
  | "createdAt"
  | "updatedAt"
>;

export interface BookingStore {
  createBooking(input: NewBookingInput): Promise<Booking>;
  getBookingsForRange(startUtc: Date, endUtc: Date): Promise<Booking[]>;
  getBookingsByTab(tab: "upcoming" | "completed" | "cancelled"): Promise<Booking[]>;
  getBookingById(id: string): Promise<Booking | null>;
  updateBookingStatus(id: string, status: "confirmed" | "cancelled" | "completed"): Promise<Booking | null>;
  updateBookingFlags(
    id: string,
    flags: Partial<{
      confirmationEmailSent: boolean;
      adminEmailSent: boolean;
      startEmailSent: boolean;
      adminReminderSent: boolean;
    }>
  ): Promise<void>;
  claimStartEmail(id: string, now: Date): Promise<boolean>;
  releaseStartEmailClaim(id: string): Promise<void>;
  findPendingStartEmails(now: Date): Promise<Booking[]>;
  findPendingAdminReminders(now: Date): Promise<Booking[]>;
  checkEmailConflict(email: string, startTime: Date): Promise<boolean>;
}

export class SlotAlreadyBookedError extends Error {
  constructor(message = "This time slot is already reserved. Please select another time.") {
    super(message);
    this.name = "SlotAlreadyBookedError";
  }
}

interface SqliteBookingRow {
  id: string;
  name: string;
  phone: string;
  email: string;
  social_handle: string | null;
  meeting_type: "zoom" | "phone";
  start_time: string;
  end_time: string;
  client_timezone: string;
  status: "confirmed" | "cancelled" | "completed";
  confirmation_email_sent: number;
  admin_email_sent: number;
  start_email_sent: number;
  admin_reminder_sent: number;
  start_email_claimed_at: string | null;
  created_at: string;
  updated_at: string;
}

function mapSqliteRow(row: SqliteBookingRow): Booking {
  return {
    _id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    socialHandle: row.social_handle || "",
    meetingType: row.meeting_type,
    startTime: new Date(row.start_time),
    endTime: new Date(row.end_time),
    clientTimezone: row.client_timezone || "America/New_York",
    status: row.status,
    confirmationEmailSent: Boolean(row.confirmation_email_sent),
    adminEmailSent: Boolean(row.admin_email_sent),
    startEmailSent: Boolean(row.start_email_sent),
    adminReminderSent: Boolean(row.admin_reminder_sent),
    startEmailClaimedAt: row.start_email_claimed_at
      ? new Date(row.start_email_claimed_at)
      : null,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  };
}

// --------------------------------------------------------------------------
// SQLITE STORE IMPLEMENTATION
// --------------------------------------------------------------------------
export class SqliteBookingStore implements BookingStore {
  async createBooking(input: NewBookingInput): Promise<Booking> {
    const db = getDb();
    const now = new Date();
    const id = crypto.randomUUID();
    const startIso = input.startTime.toISOString();
    const endIso = input.endTime.toISOString();
    const nowIso = now.toISOString();

    const insertStmt = db.prepare(`
      INSERT INTO bookings (
        id,
        name,
        phone,
        email,
        social_handle,
        meeting_type,
        start_time,
        end_time,
        client_timezone,
        status,
        confirmation_email_sent,
        admin_email_sent,
        start_email_sent,
        admin_reminder_sent,
        start_email_claimed_at,
        created_at,
        updated_at
      ) VALUES (
        @id,
        @name,
        @phone,
        @email,
        @socialHandle,
        @meetingType,
        @startTime,
        @endTime,
        @clientTimezone,
        'confirmed',
        0,
        0,
        0,
        0,
        NULL,
        @createdAt,
        @updatedAt
      )
    `);

    try {
      insertStmt.run({
        id,
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim().toLowerCase(),
        socialHandle: (input.socialHandle || "").trim(),
        meetingType: input.meetingType,
        startTime: startIso,
        endTime: endIso,
        clientTimezone: input.clientTimezone || "America/New_York",
        createdAt: nowIso,
        updatedAt: nowIso,
      });

      return {
        _id: id,
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim().toLowerCase(),
        socialHandle: (input.socialHandle || "").trim(),
        meetingType: input.meetingType,
        startTime: input.startTime,
        endTime: input.endTime,
        clientTimezone: input.clientTimezone || "America/New_York",
        status: "confirmed",
        confirmationEmailSent: false,
        adminEmailSent: false,
        startEmailSent: false,
        adminReminderSent: false,
        startEmailClaimedAt: null,
        createdAt: now,
        updatedAt: now,
      };
    } catch (err: unknown) {
      const errStr = String(err);
      if (
        errStr.includes("UNIQUE constraint failed") ||
        (err && typeof err === "object" && "code" in err && err.code === "SQLITE_CONSTRAINT_UNIQUE")
      ) {
        throw new SlotAlreadyBookedError();
      }
      throw err;
    }
  }

  async getBookingsForRange(startUtc: Date, endUtc: Date): Promise<Booking[]> {
    const db = getDb();
    const rows = db
      .prepare(
        `SELECT * FROM bookings 
         WHERE status = 'confirmed' 
           AND start_time >= ? 
           AND start_time < ? 
         ORDER BY start_time ASC`
      )
      .all(startUtc.toISOString(), endUtc.toISOString()) as SqliteBookingRow[];

    return rows.map(mapSqliteRow);
  }

  async getBookingsByTab(tab: "upcoming" | "completed" | "cancelled"): Promise<Booking[]> {
    const db = getDb();
    const nowIso = new Date().toISOString();

    let rows: SqliteBookingRow[] = [];

    if (tab === "upcoming") {
      rows = db
        .prepare(
          `SELECT * FROM bookings 
           WHERE status = 'confirmed' AND start_time >= ? 
           ORDER BY start_time ASC`
        )
        .all(nowIso) as SqliteBookingRow[];
    } else if (tab === "completed") {
      rows = db
        .prepare(
          `SELECT * FROM bookings 
           WHERE status = 'completed' OR (status = 'confirmed' AND start_time < ?) 
           ORDER BY start_time DESC`
        )
        .all(nowIso) as SqliteBookingRow[];
    } else {
      rows = db
        .prepare(
          `SELECT * FROM bookings 
           WHERE status = 'cancelled' 
           ORDER BY start_time DESC`
        )
        .all() as SqliteBookingRow[];
    }

    return rows.map(mapSqliteRow);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const db = getDb();
    const row = db
      .prepare(`SELECT * FROM bookings WHERE id = ? LIMIT 1`)
      .get(id) as SqliteBookingRow | undefined;

    return row ? mapSqliteRow(row) : null;
  }

  async updateBookingStatus(
    id: string,
    status: "confirmed" | "cancelled" | "completed"
  ): Promise<Booking | null> {
    const db = getDb();
    const nowIso = new Date().toISOString();

    db.prepare(`UPDATE bookings SET status = ?, updated_at = ? WHERE id = ?`).run(
      status,
      nowIso,
      id
    );

    return this.getBookingById(id);
  }

  async updateBookingFlags(
    id: string,
    flags: Partial<{
      confirmationEmailSent: boolean;
      adminEmailSent: boolean;
      startEmailSent: boolean;
      adminReminderSent: boolean;
    }>
  ): Promise<void> {
    const db = getDb();
    const sets: string[] = ["updated_at = ?"];
    const params: (string | number)[] = [new Date().toISOString()];

    if (flags.confirmationEmailSent !== undefined) {
      sets.push("confirmation_email_sent = ?");
      params.push(flags.confirmationEmailSent ? 1 : 0);
    }
    if (flags.adminEmailSent !== undefined) {
      sets.push("admin_email_sent = ?");
      params.push(flags.adminEmailSent ? 1 : 0);
    }
    if (flags.startEmailSent !== undefined) {
      sets.push("start_email_sent = ?");
      params.push(flags.startEmailSent ? 1 : 0);
    }
    if (flags.adminReminderSent !== undefined) {
      sets.push("admin_reminder_sent = ?");
      params.push(flags.adminReminderSent ? 1 : 0);
    }

    params.push(id);
    const sql = `UPDATE bookings SET ${sets.join(", ")} WHERE id = ?`;
    db.prepare(sql).run(...params);
  }

  async claimStartEmail(id: string, now: Date): Promise<boolean> {
    const db = getDb();
    const nowIso = now.toISOString();
    const tenMinutesAgoIso = new Date(now.getTime() - 10 * 60 * 1000).toISOString();

    const result = db
      .prepare(
        `UPDATE bookings 
         SET start_email_claimed_at = ?, updated_at = ? 
         WHERE id = ? 
           AND status = 'confirmed' 
           AND start_email_sent = 0 
           AND (start_email_claimed_at IS NULL OR start_email_claimed_at < ?)`
      )
      .run(nowIso, nowIso, id, tenMinutesAgoIso);

    return result.changes > 0;
  }

  async releaseStartEmailClaim(id: string): Promise<void> {
    const db = getDb();
    db.prepare(
      `UPDATE bookings SET start_email_claimed_at = NULL, updated_at = ? WHERE id = ?`
    ).run(new Date().toISOString(), id);
  }

  async findPendingStartEmails(now: Date): Promise<Booking[]> {
    const db = getDb();
    const nowIso = now.toISOString();
    const thirtyMinsAgoIso = new Date(now.getTime() - 30 * 60 * 1000).toISOString();

    const rows = db
      .prepare(
        `SELECT * FROM bookings 
         WHERE status = 'confirmed' 
           AND start_email_sent = 0 
           AND start_time <= ? 
           AND start_time > ? 
         ORDER BY start_time ASC`
      )
      .all(nowIso, thirtyMinsAgoIso) as SqliteBookingRow[];

    return rows.map(mapSqliteRow);
  }

  async findPendingAdminReminders(now: Date): Promise<Booking[]> {
    const db = getDb();
    const in15MinsIso = new Date(now.getTime() + 15 * 60 * 1000).toISOString();
    const in5MinsIso = new Date(now.getTime() + 5 * 60 * 1000).toISOString();

    const rows = db
      .prepare(
        `SELECT * FROM bookings 
         WHERE status = 'confirmed' 
           AND admin_reminder_sent = 0 
           AND start_time > ? 
           AND start_time <= ? 
         ORDER BY start_time ASC`
      )
      .all(in5MinsIso, in15MinsIso) as SqliteBookingRow[];

    return rows.map(mapSqliteRow);
  }

  async checkEmailConflict(email: string, startTime: Date): Promise<boolean> {
    const db = getDb();
    const row = db
      .prepare(
        `SELECT COUNT(*) as count FROM bookings 
         WHERE email = ? 
           AND status = 'confirmed' 
           AND start_time = ?`
      )
      .get(email.trim().toLowerCase(), startTime.toISOString()) as { count: number };

    return (row?.count ?? 0) > 0;
  }
}

// --------------------------------------------------------------------------
// IN-MEMORY STORE IMPLEMENTATION (FOR DEV / UNIT TESTING)
// --------------------------------------------------------------------------
declare global {
  // eslint-disable-next-line no-var
  var _memoryBookings: Booking[] | undefined;
}

export class MemoryBookingStore implements BookingStore {
  private get store(): Booking[] {
    if (!global._memoryBookings) {
      global._memoryBookings = [];
    }
    return global._memoryBookings;
  }

  async createBooking(input: NewBookingInput): Promise<Booking> {
    const exists = this.store.some(
      (b) =>
        b.status === "confirmed" &&
        b.startTime.getTime() === input.startTime.getTime()
    );

    if (exists) {
      throw new SlotAlreadyBookedError();
    }

    const now = new Date();
    const newBooking: Booking = {
      _id: "mem_" + Math.random().toString(36).substring(2, 11),
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      socialHandle: (input.socialHandle || "").trim(),
      meetingType: input.meetingType,
      startTime: input.startTime,
      endTime: input.endTime,
      clientTimezone: input.clientTimezone || "America/New_York",
      status: "confirmed",
      confirmationEmailSent: false,
      adminEmailSent: false,
      startEmailSent: false,
      adminReminderSent: false,
      startEmailClaimedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    this.store.push(newBooking);
    return newBooking;
  }

  async getBookingsForRange(startUtc: Date, endUtc: Date): Promise<Booking[]> {
    return this.store
      .filter(
        (b) =>
          b.status === "confirmed" &&
          b.startTime >= startUtc &&
          b.startTime < endUtc
      )
      .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
  }

  async getBookingsByTab(tab: "upcoming" | "completed" | "cancelled"): Promise<Booking[]> {
    const now = new Date();
    if (tab === "upcoming") {
      return this.store
        .filter((b) => b.status === "confirmed" && b.startTime >= now)
        .sort((a, b) => a.startTime.getTime() - b.startTime.getTime());
    } else if (tab === "completed") {
      return this.store
        .filter(
          (b) =>
            b.status === "completed" ||
            (b.status === "confirmed" && b.startTime < now)
        )
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    } else {
      return this.store
        .filter((b) => b.status === "cancelled")
        .sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
    }
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const found = this.store.find((b) => b._id === id);
    return found || null;
  }

  async updateBookingStatus(
    id: string,
    status: "confirmed" | "cancelled" | "completed"
  ): Promise<Booking | null> {
    const booking = this.store.find((b) => b._id === id);
    if (!booking) return null;
    booking.status = status;
    booking.updatedAt = new Date();
    return booking;
  }

  async updateBookingFlags(
    id: string,
    flags: Partial<{
      confirmationEmailSent: boolean;
      adminEmailSent: boolean;
      startEmailSent: boolean;
      adminReminderSent: boolean;
    }>
  ): Promise<void> {
    const booking = this.store.find((b) => b._id === id);
    if (!booking) return;
    Object.assign(booking, flags);
    booking.updatedAt = new Date();
  }

  async claimStartEmail(id: string, now: Date): Promise<boolean> {
    const booking = this.store.find((b) => b._id === id);
    if (!booking) return false;
    if (booking.status !== "confirmed" || booking.startEmailSent) return false;
    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);
    if (booking.startEmailClaimedAt && booking.startEmailClaimedAt >= tenMinutesAgo) {
      return false;
    }
    booking.startEmailClaimedAt = now;
    booking.updatedAt = now;
    return true;
  }

  async releaseStartEmailClaim(id: string): Promise<void> {
    const booking = this.store.find((b) => b._id === id);
    if (!booking) return;
    booking.startEmailClaimedAt = null;
    booking.updatedAt = new Date();
  }

  async findPendingStartEmails(now: Date): Promise<Booking[]> {
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);
    return this.store.filter(
      (b) =>
        b.status === "confirmed" &&
        !b.startEmailSent &&
        b.startTime <= now &&
        b.startTime > thirtyMinsAgo
    );
  }

  async findPendingAdminReminders(now: Date): Promise<Booking[]> {
    const in15Mins = new Date(now.getTime() + 15 * 60 * 1000);
    const in5Mins = new Date(now.getTime() + 5 * 60 * 1000);
    return this.store.filter(
      (b) =>
        b.status === "confirmed" &&
        !b.adminReminderSent &&
        b.startTime > in5Mins &&
        b.startTime <= in15Mins
    );
  }

  async checkEmailConflict(email: string, startTime: Date): Promise<boolean> {
    return this.store.some(
      (b) =>
        b.status === "confirmed" &&
        b.email === email.trim().toLowerCase() &&
        b.startTime.getTime() === startTime.getTime()
    );
  }
}

let sqliteStoreInstance: SqliteBookingStore | null = null;

export function getBookingStore(): BookingStore {
  if (!sqliteStoreInstance) {
    sqliteStoreInstance = new SqliteBookingStore();
  }
  return sqliteStoreInstance;
}
