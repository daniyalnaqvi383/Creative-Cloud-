import { ObjectId, MongoServerError } from "mongodb";
import { getDb } from "./db";
import { isDbConfigured, isDev } from "./env";

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

// --------------------------------------------------------------------------
// MONGODB STORE IMPLEMENTATION
// --------------------------------------------------------------------------
export class MongoBookingStore implements BookingStore {
  async createBooking(input: NewBookingInput): Promise<Booking> {
    const db = await getDb();
    const collection = db.collection("bookings");

    const now = new Date();
    const doc = {
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim().toLowerCase(),
      socialHandle: (input.socialHandle || "").trim(),
      meetingType: input.meetingType,
      startTime: input.startTime,
      endTime: input.endTime,
      clientTimezone: input.clientTimezone || "America/New_York",
      status: "confirmed" as const,
      confirmationEmailSent: false,
      adminEmailSent: false,
      startEmailSent: false,
      adminReminderSent: false,
      startEmailClaimedAt: null,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const result = await collection.insertOne(doc);
      return {
        ...doc,
        _id: result.insertedId.toString(),
      };
    } catch (err: unknown) {
      if (err instanceof MongoServerError && err.code === 11000) {
        throw new SlotAlreadyBookedError();
      }
      throw err;
    }
  }

  async getBookingsForRange(startUtc: Date, endUtc: Date): Promise<Booking[]> {
    const db = await getDb();
    const docs = await db
      .collection("bookings")
      .find({
        status: "confirmed",
        startTime: { $gte: startUtc, $lt: endUtc },
      })
      .sort({ startTime: 1 })
      .toArray();

    return docs.map(mapMongoDoc);
  }

  async getBookingsByTab(tab: "upcoming" | "completed" | "cancelled"): Promise<Booking[]> {
    const db = await getDb();
    const now = new Date();

    let query: Record<string, unknown> = {};

    if (tab === "upcoming") {
      query = {
        status: "confirmed",
        startTime: { $gte: now },
      };
    } else if (tab === "completed") {
      query = {
        $or: [
          { status: "completed" },
          { status: "confirmed", startTime: { $lt: now } },
        ],
      };
    } else {
      query = { status: "cancelled" };
    }

    const sortOrder = tab === "upcoming" ? 1 : -1;

    const docs = await db
      .collection("bookings")
      .find(query)
      .sort({ startTime: sortOrder })
      .toArray();

    return docs.map(mapMongoDoc);
  }

  async getBookingById(id: string): Promise<Booking | null> {
    const db = await getDb();
    let query: Record<string, unknown>;
    try {
      query = { _id: new ObjectId(id) };
    } catch {
      query = { _id: id };
    }
    const doc = await db.collection("bookings").findOne(query);
    return doc ? mapMongoDoc(doc) : null;
  }

  async updateBookingStatus(
    id: string,
    status: "confirmed" | "cancelled" | "completed"
  ): Promise<Booking | null> {
    const db = await getDb();
    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    const result = await db.collection("bookings").findOneAndUpdate(
      filter,
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result ? mapMongoDoc(result) : null;
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
    const db = await getDb();
    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    await db.collection("bookings").updateOne(filter, {
      $set: {
        ...flags,
        updatedAt: new Date(),
      },
    });
  }

  async claimStartEmail(id: string, now: Date): Promise<boolean> {
    const db = await getDb();
    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    const tenMinutesAgo = new Date(now.getTime() - 10 * 60 * 1000);

    const result = await db.collection("bookings").findOneAndUpdate(
      {
        ...filter,
        status: "confirmed",
        startEmailSent: false,
        $or: [
          { startEmailClaimedAt: null },
          { startEmailClaimedAt: { $lt: tenMinutesAgo } }, // Expired lock
        ],
      },
      {
        $set: {
          startEmailClaimedAt: now,
          updatedAt: now,
        },
      }
    );

    return !!result;
  }

  async releaseStartEmailClaim(id: string): Promise<void> {
    const db = await getDb();
    let filter: Record<string, unknown>;
    try {
      filter = { _id: new ObjectId(id) };
    } catch {
      filter = { _id: id };
    }

    await db.collection("bookings").updateOne(filter, {
      $set: {
        startEmailClaimedAt: null,
        updatedAt: new Date(),
      },
    });
  }

  async findPendingStartEmails(now: Date): Promise<Booking[]> {
    const db = await getDb();
    const thirtyMinsAgo = new Date(now.getTime() - 30 * 60 * 1000);

    const docs = await db
      .collection("bookings")
      .find({
        status: "confirmed",
        startEmailSent: false,
        startTime: { $lte: now, $gt: thirtyMinsAgo },
      })
      .toArray();

    return docs.map(mapMongoDoc);
  }

  async findPendingAdminReminders(now: Date): Promise<Booking[]> {
    const db = await getDb();
    // 10 minutes from now +/- 5 minute window
    const in15Mins = new Date(now.getTime() + 15 * 60 * 1000);
    const in5Mins = new Date(now.getTime() + 5 * 60 * 1000);

    const docs = await db
      .collection("bookings")
      .find({
        status: "confirmed",
        adminReminderSent: false,
        startTime: { $gt: in5Mins, $lte: in15Mins },
      })
      .toArray();

    return docs.map(mapMongoDoc);
  }

  async checkEmailConflict(email: string, startTime: Date): Promise<boolean> {
    const db = await getDb();
    const count = await db.collection("bookings").countDocuments({
      email: email.trim().toLowerCase(),
      status: "confirmed",
      startTime,
    });
    return count > 0;
  }
}

// --------------------------------------------------------------------------
// IN-MEMORY STORE IMPLEMENTATION (FOR DEV MODE WHEN MONGODB NOT CONFIGURED)
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
    // Check double-booking
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
    console.log(
      `[IN-MEMORY STORE] Booking created: ${newBooking.name} (${newBooking.meetingType}) at ${newBooking.startTime.toISOString()}`
    );
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

// Helper to convert Mongo Doc to Booking object
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapMongoDoc(doc: any): Booking {
  return {
    _id: doc._id.toString(),
    name: doc.name,
    phone: doc.phone,
    email: doc.email,
    socialHandle: doc.socialHandle || "",
    meetingType: doc.meetingType,
    startTime: doc.startTime instanceof Date ? doc.startTime : new Date(doc.startTime),
    endTime: doc.endTime instanceof Date ? doc.endTime : new Date(doc.endTime),
    clientTimezone: doc.clientTimezone || "America/New_York",
    status: doc.status,
    confirmationEmailSent: !!doc.confirmationEmailSent,
    adminEmailSent: !!doc.adminEmailSent,
    startEmailSent: !!doc.startEmailSent,
    adminReminderSent: !!doc.adminReminderSent,
    startEmailClaimedAt: doc.startEmailClaimedAt
      ? new Date(doc.startEmailClaimedAt)
      : null,
    createdAt: doc.createdAt instanceof Date ? doc.createdAt : new Date(doc.createdAt),
    updatedAt: doc.updatedAt instanceof Date ? doc.updatedAt : new Date(doc.updatedAt),
  };
}

let warnedMemoryStore = false;

export function getBookingStore(): BookingStore {
  if (isDbConfigured()) {
    return new MongoBookingStore();
  }

  if (isDev) {
    if (!warnedMemoryStore) {
      console.warn(
        "⚠️ [DEV MODE] MongoDB URI not configured. Using in-memory store for local testing."
      );
      warnedMemoryStore = true;
    }
    return new MemoryBookingStore();
  }

  throw new Error("MONGODB_URI is not configured in production.");
}
