import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { MongoClient } from "mongodb";

async function main() {
  console.log("\n==================================================");
  console.log("       CREATIVE CLOUD — DATABASE INDEX SETUP      ");
  console.log("==================================================\n");

  const uri = process.env.MONGODB_URI?.trim();
  if (!uri || uri.includes("placeholder")) {
    console.error("❌ MONGODB_URI is not set in environment variables.");
    console.error("Please add MONGODB_URI to .env.local before running setup-db.\n");
    process.exit(1);
  }

  const dbName = process.env.MONGODB_DB?.trim() || "creativecloud";
  console.log(`Connecting to MongoDB Atlas (Database: ${dbName})...`);

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);
  const collection = db.collection("bookings");

  console.log("Creating partial unique index on { startTime: 1 } where status == 'confirmed'...");
  await collection.createIndex(
    { startTime: 1 },
    {
      unique: true,
      partialFilterExpression: { status: "confirmed" },
      name: "uniq_confirmed_startTime",
    }
  );

  console.log("Creating compound index on { status: 1, startTime: 1 }...");
  await collection.createIndex(
    { status: 1, startTime: 1 },
    { name: "idx_status_startTime" }
  );

  console.log("Creating cron query index on { status: 1, startEmailSent: 1, startTime: 1 }...");
  await collection.createIndex(
    { status: 1, startEmailSent: 1, startTime: 1 },
    { name: "idx_cron_start_email" }
  );

  console.log("\nListing active indexes on 'bookings':");
  const indexes = await collection.indexes();
  for (const idx of indexes) {
    console.log(` - ${idx.name}: ${JSON.stringify(idx.key)}`);
  }

  await client.close();
  console.log("\n✅ Database indexes configured successfully!\n");
}

main().catch((err) => {
  console.error("❌ Error setting up database:", err);
  process.exit(1);
});
