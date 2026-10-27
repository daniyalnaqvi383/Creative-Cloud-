import nodemailer, { Transporter } from "nodemailer";
import { isEmailConfigured, isDev } from "./env";

export interface EmailAttachment {
  filename: string;
  content: string | Buffer;
  contentType?: string;
}

export interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
  text?: string;
  attachments?: EmailAttachment[];
}

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  devMode?: boolean;
  error?: string;
}

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  if (!isEmailConfigured()) {
    return null;
  }

  if (!transporter) {
    const user = process.env.GMAIL_USER!.trim();
    const pass = process.env.GMAIL_APP_PASSWORD!.trim();

    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    });
  }

  return transporter;
}

/**
 * Single unified interface for sending emails across the entire application.
 * If switching to Resend, SendGrid, or AWS SES later, only this file needs changes.
 */
export async function sendEmail(options: SendEmailOptions): Promise<SendEmailResult> {
  const mailer = getTransporter();

  // If email credentials are not configured
  if (!mailer) {
    if (isDev) {
      console.log("\n================ [DEV MODE EMAIL PREVIEW] ================");
      console.log(`TO:       ${options.to}`);
      console.log(`SUBJECT:  ${options.subject}`);
      console.log("----------------------- PLAIN TEXT -----------------------");
      console.log(options.text || "(No plain text provided)");
      console.log("----------------------- HTML PREVIEW ---------------------");
      console.log(options.html.substring(0, 500) + "... [truncated]");
      if (options.attachments && options.attachments.length > 0) {
        console.log(
          `ATTACHMENTS: ${options.attachments.map((a) => a.filename).join(", ")}`
        );
      }
      console.log("==========================================================\n");

      return {
        success: true,
        devMode: true,
        messageId: "dev_simulated_" + Date.now(),
      };
    } else {
      console.error(
        "❌ [EMAIL ERROR] Cannot send email. GMAIL_USER or GMAIL_APP_PASSWORD not configured."
      );
      return {
        success: false,
        error: "Email transport credentials missing in environment variables.",
      };
    }
  }

  const fromName = process.env.EMAIL_FROM_NAME?.trim() || "Creative Cloud Agency";
  const fromUser = process.env.GMAIL_USER!.trim();
  const from = `"${fromName}" <${fromUser}>`;

  try {
    const info = await mailer.sendMail({
      from,
      to: options.to,
      subject: options.subject,
      text: options.text || options.html.replace(/<[^>]*>/g, ""),
      html: options.html,
      attachments: options.attachments?.map((att) => ({
        filename: att.filename,
        content: att.content,
        contentType: att.contentType,
      })),
    });

    console.log(`✓ Email sent successfully to ${options.to} (ID: ${info.messageId})`);
    return {
      success: true,
      messageId: info.messageId,
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error(`❌ Failed to dispatch email to ${options.to}:`, errorMsg);
    return {
      success: false,
      error: errorMsg,
    };
  }
}
