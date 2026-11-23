import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

declare global {
  // eslint-disable-next-line no-var
  var _sqliteDb: Database.Database | undefined;
  // eslint-disable-next-line no-var
  var _sqliteSchemaEnsured: boolean | undefined;
}

export function getDbPath(): string {
  const customPath = process.env.SQLITE_DB_PATH?.trim();
  if (customPath) {
    return path.isAbsolute(customPath)
      ? customPath
      : path.resolve(process.cwd(), customPath);
  }
  return path.resolve(process.cwd(), "data", "creativecloud.db");
}

export function getDb(): Database.Database {
  if (process.env.NODE_ENV === "development" && global._sqliteDb) {
    return global._sqliteDb;
  }

  const dbPath = getDbPath();
  const dbDir = path.dirname(dbPath);
  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const db = new Database(dbPath);

  // Performance and integrity tuning
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("synchronous = NORMAL");

  if (!global._sqliteSchemaEnsured) {
    setupDatabaseIndexes(db);
    global._sqliteSchemaEnsured = true;
  }

  if (process.env.NODE_ENV === "development") {
    global._sqliteDb = db;
  }

  return db;
}

export function setupDatabaseIndexes(dbInstance?: Database.Database): void {
  const db = dbInstance || getDb();

  console.log("Setting up SQLite schema and indexes for 'bookings'...");

  db.exec(`
    CREATE TABLE IF NOT EXISTS bookings (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      phone TEXT NOT NULL,
      email TEXT NOT NULL,
      social_handle TEXT DEFAULT '',
      meeting_type TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT NOT NULL,
      client_timezone TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'confirmed',
      confirmation_email_sent INTEGER NOT NULL DEFAULT 0,
      admin_email_sent INTEGER NOT NULL DEFAULT 0,
      start_email_sent INTEGER NOT NULL DEFAULT 0,
      admin_reminder_sent INTEGER NOT NULL DEFAULT 0,
      start_email_claimed_at TEXT DEFAULT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE UNIQUE INDEX IF NOT EXISTS uniq_confirmed_startTime 
    ON bookings(start_time) 
    WHERE status = 'confirmed';

    CREATE INDEX IF NOT EXISTS idx_status_startTime 
    ON bookings(status, start_time);

    CREATE INDEX IF NOT EXISTS idx_cron_start_email 
    ON bookings(status, start_email_sent, start_time);
  `);

  console.log("✓ SQLite schema and indexes successfully initialized!");
}
