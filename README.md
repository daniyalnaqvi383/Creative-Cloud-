# Creative Cloud — Production Booking & Agency Platform

A modern, high-converting social media content agency website built with Next.js App Router, TypeScript, and Vanilla CSS. Features an integrated, production-ready appointment scheduling engine for 1-on-1 Zoom Video Meetings and Direct Phone Consultations.

---

## Quick Start (Local Development)

The backend is built with zero-configuration development fallbacks. You can start and test the entire website, booking form, email previews, and admin portal immediately with **zero environment keys configured**.

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the local development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3001](http://localhost:3001) in your browser.

3. **In-Memory Development Mode:**
   - **Database:** When `MONGODB_URI` is empty, an in-memory store automatically manages slots, reservations, cancellations, and status tracking.
   - **Emails:** When Gmail credentials are empty, outgoing emails (confirmation, ICS invite, admin alerts, start-of-meeting join links) are printed directly to the server terminal with full HTML/Text previews.
   - **Admin Dashboard:** Access at `/admin` (or `/admin/login`). Default dev password: `admin123`.

---

## Client Handover Checklist (Non-Technical Step-by-Step)

When ready to take the website live under the client's accounts, follow this simple checklist. **Zero code changes are required**; simply fill in the environment variables.

### 1. MongoDB Atlas (Free Cloud Database)
1. Go to [mongodb.com/atlas](https://www.mongodb.com/cloud/atlas) and sign up for a free account.
2. Create a free **M0 Shared Cluster** (e.g. AWS N. Virginia / Frankfurt).
3. Under **Security → Database Access**, click **Add New Database User**. Choose **Password Authentication**, set a username and strong password (keep note of this).
4. Under **Security → Network Access**, click **Add IP Address** and select **Allow Access from Anywhere (`0.0.0.0/0`)** so serverless Vercel functions can connect.
5. In **Database Deployments**, click **Connect → Drivers (Node.js)** and copy your connection string.
6. Replace `<db_password>` with your database user password:
   ```env
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.abcde.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=creativecloud
   ```
7. Run the index setup command once:
   ```bash
   npm run setup-db
   ```

---

### 2. Gmail SMTP (Automated Email Delivery)
1. Log in to the Google account you wish to send emails from.
2. Go to **Google Account Settings → Security**.
3. Ensure **2-Step Verification** is turned ON.
4. Search for **App Passwords** (or visit `https://myaccount.google.com/apppasswords`).
5. Create a new App Password named `Creative Cloud Website`.
6. Copy the generated 16-character password (e.g., `abcd efgh ijkl mnop`):
   ```env
   GMAIL_USER=yourstudio@gmail.com
   GMAIL_APP_PASSWORD=abcdefghijklmnop
   EMAIL_FROM_NAME=Creative Cloud Agency
   ADMIN_EMAIL=daniyalnaqvi383@gmail.com
   ```

---

### 3. Zoom Meeting Setup
1. Log into your Zoom account at [zoom.us](https://zoom.us).
2. Go to **Settings → Meetings** and ensure **Waiting Room** is enabled (so clients cannot enter meetings ahead of you).
3. Copy your **Personal Meeting ID (PMI) Link** (e.g. `https://us05web.zoom.us/j/1234567890?pwd=xyz`) and your Passcode:
   ```env
   ZOOM_MEETING_LINK=https://us05web.zoom.us/j/1234567890?pwd=xyz
   ZOOM_PASSCODE=123456
   ```

---

### 4. Admin & Security Secrets
Generate secure random 32-byte hex strings for session security and cron authorization. In PowerShell or Terminal:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```
Set your environment variables:
```env
CRON_SECRET=your_generated_32_byte_hex_for_cron
ADMIN_SESSION_SECRET=your_generated_32_byte_hex_for_sessions
ADMIN_PASSWORD=YourCustomStrongAdminPassword!
SITE_URL=https://your-domain.com
```

---

## Testing Environment Health

Run the automated environment auditor anytime to verify configuration and test live connections:
```bash
npm run check-env
```
This script will:
- Check all 12 required configuration keys.
- Perform a live ping test to your MongoDB Atlas cluster.
- Perform an authenticated handshake with Gmail SMTP.
- Output clear `[PASS]` or `[FAIL]` indicators.

---

## Vercel Deployment

1. Push your repository to GitHub or GitLab.
2. In [Vercel Dashboard](https://vercel.com), click **Add New Project** and select this repository.
3. In **Settings → Environment Variables**, copy each key and value from your `.env.local`:
   - `MONGODB_URI`
   - `MONGODB_DB`
   - `GMAIL_USER`
   - `GMAIL_APP_PASSWORD`
   - `EMAIL_FROM_NAME`
   - `ADMIN_EMAIL`
   - `ZOOM_MEETING_LINK`
   - `ZOOM_PASSCODE`
   - `CRON_SECRET`
   - `ADMIN_PASSWORD`
   - `ADMIN_SESSION_SECRET`
   - `SITE_URL`
4. Deploy the project. The build will compile cleanly and deploy to production.

---

## 1-Minute Automated Cron Setup (cron-job.org)

To automatically dispatch "Your Meeting is Starting Now" Join links and 10-minute admin reminder warnings on Vercel Hobby tier:

1. Sign up for a free account at [cron-job.org](https://cron-job.org).
2. Click **Create Cronjob**.
3. Configure the following fields:
   - **Title:** `Creative Cloud - Meeting Start Emails`
   - **URL:** `https://your-site.vercel.app/api/cron/send-start-emails`
   - **Execution Schedule:** `Every 1 minute` (or `*/1 * * * *`)
   - **Request Method:** `GET`
   - **Headers:** Click **Add Header**:
     - Key: `Authorization`
     - Value: `Bearer YOUR_CRON_SECRET_VALUE` (replace with the exact `CRON_SECRET` you set in Vercel)
4. Click **Save**.

The cron job will run every minute to check for meetings starting right now and dispatch the join links with zero server overhead.

---

## Upgrading from Gmail to Resend (Optional)

When the client attaches a custom domain (e.g. `@creativecloud.agency`):
1. Create a free account at [resend.com](https://resend.com) and add the domain DNS records.
2. Open [lib/email.ts](file:///e:/abdullah's%20site/lib/email.ts) — this is the **only file** in the entire codebase that communicates with the email transport.
3. Replace the `nodemailer` transporter with the Resend SDK or standard Resend API call:
   ```ts
   import { Resend } from "resend";
   const resend = new Resend(process.env.RESEND_API_KEY);
   // resend.emails.send(...)
   ```
All email templates, ICS calendar generators, and notification queues will continue functioning with zero changes.

---

## Admin Portal Features (`/admin`)

- **Upcoming:** Chronological list of confirmed meetings with client contact details, selected format (Zoom vs Phone), and times in both Pakistan Standard Time (PKT) and Eastern Standard Time (EST).
- **Completed:** History of past sessions.
- **Cancelled:** Sessions cancelled by admin.
- **Actions:**
  - **Cancel:** Instantly frees up the calendar slot for new clients and dispatches a polite cancellation email with rescheduling link to the client.
  - **Done:** Marks the meeting as completed.
- **Diagnostics Notice:** Displays non-intrusive status badges if any production environment variable is missing.
