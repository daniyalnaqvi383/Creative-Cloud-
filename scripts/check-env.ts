import { loadEnvConfig } from "@next/env";
loadEnvConfig(process.cwd());

import nodemailer from "nodemailer";
import { getDb, getDbPath } from "../lib/db";

async function main() {
  console.log("\n==================================================");
  console.log("       CREATIVE CLOUD — ENVIRONMENT AUDIT         ");
  console.log("==================================================\n");

  const results: { key: string; status: "PASS" | "FAIL" | "WARN"; message: string }[] = [];

  const checks = [
    { key: "SQLITE_DB_PATH", label: "SQLite Database Path (default: data/creativecloud.db)", optional: true },
    { key: "GMAIL_USER", label: "Gmail Address for Outgoing SMTP" },
    { key: "GMAIL_APP_PASSWORD", label: "16-Character Gmail App Password" },
    { key: "EMAIL_FROM_NAME", label: "Sender Display Name" },
    { key: "ADMIN_EMAIL", label: "Admin Alert Recipient Email" },
    { key: "ZOOM_MEETING_LINK", label: "Personal Zoom Meeting Room URL" },
    { key: "ZOOM_PASSCODE", label: "Zoom Room Passcode" },
    { key: "CRON_SECRET", label: "Cron Runner Authorization Secret" },
    { key: "ADMIN_PASSWORD", label: "Admin Dashboard Master Password" },
    { key: "ADMIN_SESSION_SECRET", label: "Admin Session Encryption Secret" },
    { key: "SITE_URL", label: "Canonical Production URL" },
  ];

  for (const item of checks) {
    const val = process.env[item.key];
    const isFilled =
      val &&
      val.trim() !== "" &&
      !val.includes("placeholder") &&
      !val.includes("your-");

    if (isFilled) {
      results.push({ key: item.key, status: "PASS", message: `Configured (${item.label})` });
    } else if (item.optional) {
      results.push({ key: item.key, status: "PASS", message: `Defaulting to data/creativecloud.db (${item.label})` });
    } else {
      results.push({ key: item.key, status: "FAIL", message: `Missing / Empty (${item.label})` });
    }
  }

  // Print Variable Status
  for (const r of results) {
    const symbol = r.status === "PASS" ? "✅" : "❌";
    console.log(`${symbol} [${r.status}] ${r.key.padEnd(22)} : ${r.message}`);
  }

  console.log("\n---------------- LIVE SERVICE CHECKS -------------");

  // 1. Live SQLite File and Table Test
  process.stdout.write("⏳ Testing SQLite database connection... ");
  try {
    const dbPath = getDbPath();
    const db = getDb();
    const result = db.pragma("quick_check") as Array<Record<string, unknown>>;
    console.log(`✅ PASS (SQLite operational at ${dbPath}, integrity check: ${JSON.stringify(result[0])})`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.log(`❌ FAIL (${msg})`);
  }

  // 2. Live Gmail SMTP Verification Test
  const gmailUser = process.env.GMAIL_USER?.trim();
  const gmailPass = process.env.GMAIL_APP_PASSWORD?.trim();
  if (gmailUser && gmailPass && !gmailPass.includes("placeholder")) {
    process.stdout.write("⏳ Testing Gmail SMTP credentials... ");
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: { user: gmailUser, pass: gmailPass },
      });
      await transporter.verify();
      console.log("✅ PASS (SMTP authenticated)");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      console.log(`❌ FAIL (${msg})`);
    }
  } else {
    console.log("⚠️  Gmail SMTP: Skipped (GMAIL_USER or GMAIL_APP_PASSWORD empty)");
  }

  console.log("\n==================================================\n");
}

main().catch(console.error);
