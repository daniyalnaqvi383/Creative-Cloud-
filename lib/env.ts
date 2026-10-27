import { z } from "zod";

/**
 * Checks if a string value is meaningfully configured (not empty, whitespace, or generic placeholder).
 */
export function isConfiguredValue(val: string | undefined | null): boolean {
  if (!val) return false;
  const trimmed = val.trim();
  if (trimmed === "") return false;
  const lower = trimmed.toLowerCase();
  if (
    lower.includes("placeholder") ||
    lower.includes("your-") ||
    lower.includes("changeme") ||
    lower === "none" ||
    lower === "null" ||
    lower === "undefined"
  ) {
    return false;
  }
  return true;
}

const rawEnv = {
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGODB_URI: process.env.MONGODB_URI,
  MONGODB_DB: process.env.MONGODB_DB || "creativecloud",
  GMAIL_USER: process.env.GMAIL_USER,
  GMAIL_APP_PASSWORD: process.env.GMAIL_APP_PASSWORD,
  EMAIL_FROM_NAME: process.env.EMAIL_FROM_NAME || "Creative Cloud Agency",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || "daniyalnaqvi383@gmail.com",
  ZOOM_MEETING_LINK: process.env.ZOOM_MEETING_LINK,
  ZOOM_PASSCODE: process.env.ZOOM_PASSCODE,
  CRON_SECRET: process.env.CRON_SECRET,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD,
  ADMIN_SESSION_SECRET: process.env.ADMIN_SESSION_SECRET,
  SITE_URL: process.env.SITE_URL || "http://localhost:3001",
};

export const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  MONGODB_URI: z.string().optional(),
  MONGODB_DB: z.string().default("creativecloud"),
  GMAIL_USER: z.string().optional(),
  GMAIL_APP_PASSWORD: z.string().optional(),
  EMAIL_FROM_NAME: z.string().default("Creative Cloud Agency"),
  ADMIN_EMAIL: z.string().email().default("daniyalnaqvi383@gmail.com"),
  ZOOM_MEETING_LINK: z.string().optional(),
  ZOOM_PASSCODE: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  ADMIN_PASSWORD: z.string().optional(),
  ADMIN_SESSION_SECRET: z.string().optional(),
  SITE_URL: z.string().default("http://localhost:3001"),
});

export const env = envSchema.parse(rawEnv);

export const isDev = env.NODE_ENV !== "production";

export function isDbConfigured(): boolean {
  return isConfiguredValue(process.env.MONGODB_URI);
}

export function isEmailConfigured(): boolean {
  return (
    isConfiguredValue(process.env.GMAIL_USER) &&
    isConfiguredValue(process.env.GMAIL_APP_PASSWORD)
  );
}

export function isZoomConfigured(): boolean {
  return isConfiguredValue(process.env.ZOOM_MEETING_LINK);
}

export function isAdminConfigured(): boolean {
  if (isDev) return true; // In dev, we allow fallback admin123
  return (
    isConfiguredValue(process.env.ADMIN_PASSWORD) &&
    isConfiguredValue(process.env.ADMIN_SESSION_SECRET)
  );
}

export function isCronConfigured(): boolean {
  if (isDev) return true;
  return isConfiguredValue(process.env.CRON_SECRET);
}

// Dev fallback values with warnings
let warnedAdminPass = false;
export function getAdminPassword(): string {
  if (isConfiguredValue(process.env.ADMIN_PASSWORD)) {
    return process.env.ADMIN_PASSWORD!.trim();
  }
  if (isDev) {
    if (!warnedAdminPass) {
      console.warn(
        "⚠️ [DEV MODE] ADMIN_PASSWORD not configured. Using temporary dev password: 'admin123'"
      );
      warnedAdminPass = true;
    }
    return "admin123";
  }
  throw new Error("ADMIN_PASSWORD is required in production");
}

let warnedSessionSecret = false;
export function getAdminSessionSecret(): string {
  if (isConfiguredValue(process.env.ADMIN_SESSION_SECRET)) {
    return process.env.ADMIN_SESSION_SECRET!.trim();
  }
  if (isDev) {
    if (!warnedSessionSecret) {
      console.warn(
        "⚠️ [DEV MODE] ADMIN_SESSION_SECRET not configured. Using dev fallback secret."
      );
      warnedSessionSecret = true;
    }
    return "dev_secret_key_creative_cloud_super_session_32_bytes_min";
  }
  throw new Error("ADMIN_SESSION_SECRET is required in production");
}

let warnedCronSecret = false;
export function getCronSecret(): string {
  if (isConfiguredValue(process.env.CRON_SECRET)) {
    return process.env.CRON_SECRET!.trim();
  }
  if (isDev) {
    if (!warnedCronSecret) {
      console.warn("⚠️ [DEV MODE] CRON_SECRET not configured. Using dev fallback cron secret.");
      warnedCronSecret = true;
    }
    return "dev_cron_secret_creative_cloud";
  }
  throw new Error("CRON_SECRET is required in production");
}

export function getMissingVars(): { key: string; requiredFor: string }[] {
  const missing: { key: string; requiredFor: string }[] = [];
  if (!isConfiguredValue(process.env.MONGODB_URI)) {
    missing.push({ key: "MONGODB_URI", requiredFor: "Production Database Persistence" });
  }
  if (!isConfiguredValue(process.env.GMAIL_USER)) {
    missing.push({ key: "GMAIL_USER", requiredFor: "Email Dispatch" });
  }
  if (!isConfiguredValue(process.env.GMAIL_APP_PASSWORD)) {
    missing.push({ key: "GMAIL_APP_PASSWORD", requiredFor: "Email Dispatch" });
  }
  if (!isConfiguredValue(process.env.ZOOM_MEETING_LINK)) {
    missing.push({ key: "ZOOM_MEETING_LINK", requiredFor: "Zoom Meeting Start Invites" });
  }
  if (!isConfiguredValue(process.env.CRON_SECRET)) {
    missing.push({ key: "CRON_SECRET", requiredFor: "Automated Meeting Start Emails via Cron" });
  }
  if (!isConfiguredValue(process.env.ADMIN_PASSWORD)) {
    missing.push({ key: "ADMIN_PASSWORD", requiredFor: "Admin Dashboard Login" });
  }
  if (!isConfiguredValue(process.env.ADMIN_SESSION_SECRET)) {
    missing.push({ key: "ADMIN_SESSION_SECRET", requiredFor: "Admin Session Security" });
  }
  return missing;
}
