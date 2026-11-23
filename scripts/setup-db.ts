import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import { getDb, getDbPath, setupDatabaseIndexes } from "../lib/db";

async function main() {
  console.log("\n==================================================");
  console.log("       CREATIVE CLOUD — SQLITE DATABASE SETUP     ");
  console.log("==================================================\n");

  const dbPath = getDbPath();
  console.log(`Database File: ${dbPath}`);

  const db = getDb();
  setupDatabaseIndexes(db);

  // Check indexes
  console.log("\nListing active indexes on 'bookings' table:");
  const indexes = db.prepare(`PRAGMA index_list('bookings')`).all() as Array<{ name: string; unique: number }>;
  for (const idx of indexes) {
    console.log(` - ${idx.name} (unique: ${idx.unique === 1 ? "yes" : "no"})`);
  }

  // Quick count test
  const countRow = db.prepare(`SELECT COUNT(*) as count FROM bookings`).get() as { count: number };
  console.log(`\nCurrent total bookings in database: ${countRow.count}`);

  console.log("\n✅ SQLite database & indexes initialized successfully!\n");
}

main().catch((err) => {
  console.error("❌ Error setting up SQLite database:", err);
  process.exit(1);
});
