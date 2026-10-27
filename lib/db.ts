import { MongoClient, Db } from "mongodb";
import { isDbConfigured } from "./env";

declare global {
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined;
  // eslint-disable-next-line no-var
  var _mongoIndexesEnsured: boolean | undefined;
}

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

export async function getMongoClient(): Promise<MongoClient> {
  if (!isDbConfigured()) {
    throw new Error("MONGODB_URI is not configured in environment variables.");
  }

  const uri = process.env.MONGODB_URI!.trim();

  if (process.env.NODE_ENV === "development") {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR.
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri);
      global._mongoClientPromise = client.connect();
    }
    return global._mongoClientPromise;
  } else {
    // In production mode, it's best to not use a global variable.
    if (!clientPromise) {
      client = new MongoClient(uri);
      clientPromise = client.connect();
    }
    return clientPromise;
  }
}

export async function getDb(): Promise<Db> {
  const client = await getMongoClient();
  const dbName = process.env.MONGODB_DB?.trim() || "creativecloud";
  const db = client.db(dbName);

  // Auto-ensure indexes once per process lifetime
  if (!global._mongoIndexesEnsured) {
    setupDatabaseIndexes(db).catch((err) => {
      console.error("Failed to auto-ensure MongoDB indexes:", err);
    });
    global._mongoIndexesEnsured = true;
  }

  return db;
}

export async function setupDatabaseIndexes(dbInstance?: Db): Promise<void> {
  const db = dbInstance || (await getDb());
  const collection = db.collection("bookings");

  console.log("Setting up MongoDB indexes on 'bookings' collection...");

  // 1. UNIQUE { startTime: 1 } for confirmed bookings (prevents double booking)
  await collection.createIndex(
    { startTime: 1 },
    {
      unique: true,
      partialFilterExpression: { status: "confirmed" },
      name: "uniq_confirmed_startTime",
    }
  );

  // 2. Compound index for status and start time lookups
  await collection.createIndex(
    { status: 1, startTime: 1 },
    { name: "idx_status_startTime" }
  );

  // 3. Index for cron queries on startEmailSent
  await collection.createIndex(
    { status: 1, startEmailSent: 1, startTime: 1 },
    { name: "idx_cron_start_email" }
  );

  console.log("✓ MongoDB indexes successfully ensured!");
}
