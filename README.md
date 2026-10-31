# The Urban Physio - Patient Enquiry & Consultation Web App

A lightweight, modern, responsive patient intake and enquiry web application designed for **The Urban Physio** (https://theurbanphysio.com). Built specifically for zero-maintenance hosting on **Cloudflare Pages** with serverless mail delivery powered by **Twilio SendGrid**.

---

## 📁 Project Structure

```text
Enquary_Form/
├── index.html                  # Responsive Patient Intake Form
├── style.css                   # The Urban Physio branding & UI styles
├── script.js                   # Date/Day auto-calculation, validation, API submission
├── functions/
│   └── api/
│       └── send-enquiry.js     # Cloudflare Pages Serverless Function (Twilio SendGrid API)
└── README.md                   # Setup and Cloudflare deployment guide
```

---

## 🩺 Form Features Included

1. **Patient Personal Information:**
   - Full Name
   - Phone / WhatsApp Number (10 digits)
   - Email Address
   - Age & Gender

2. **Complete Address Details:**
   - Flat / House No., Building & Street
   - Locality / Landmark
   - City
   - 6-digit Pincode

3. **Medical Concern & Clinical History:**
   - Primary Problem Area (Back pain, Cervical, Knee, Sports injury, Post-surgery, etc.)
   - Duration of Problem (Acute / Subacute / Chronic)
   - Detailed Problem & Symptoms Description
   - Interactive Pain Severity Slider (1 to 10 scale with dynamic badge)
   - Past Medical / Surgical History
   - Ongoing Medications / Previous Physiotherapy treatments

4. **Appointment Preferences:**
   - Consultation Mode: Clinic Visit / Home Visit / Online Video
   - Preferred Date (min date restricted to today)
   - Auto-calculated Day of the Week (Monday, Tuesday, etc.)
   - Preferred Time Slot (Morning, Afternoon, Evening)
   - Special Instructions / Notes

5. **Doctor Email Notification:**
   - Doctor receives an organized HTML email report with all clinical details.
   - Includes one-click **"📞 Call Patient"** and **"💬 Open WhatsApp"** action buttons for immediate follow-up.

---

## 🚀 Cloudflare Pages Deployment & Setup Guide

### Step 1: Twilio SendGrid Setup (Takes 2 minutes)
1. Go to [SendGrid](https://signup.sendgrid.com/) and create a free account.
2. In the SendGrid dashboard, go to **Settings** > **Sender Authentication**.
3. Verify a Single Sender Email (e.g. `support@theurbanphysio.com` or your own email). This will be your `FROM_EMAIL`.
4. Go to **Settings** > **API Keys** > Click **Create API Key**.
   - Name it `Cloudflare-Enquiry-Form`
   - Permissions: Select **Restricted Access** > **Mail Send** (Full Access).
   - Copy the API Key (starts with `SG.xxxx`).

---

### Step 2: Deploy on Cloudflare Pages
1. Login to your [Cloudflare Dashboard](https://dash.cloudflare.com/).
2. In the left sidebar, click **Workers & Pages** > **Create application** > Select **Pages**.
3. You can either:
   - **Option A (Via GitHub/GitLab):** Push this `Enquary_Form` folder to a Git repository and connect it.
   - **Option B (Direct Upload):** Drag and drop the `Enquary_Form` folder directly into Cloudflare Pages.
4. Set Build Settings:
   - **Framework preset:** `None`
   - **Build command:** (Leave empty)
   - **Build output directory:** (Leave as root `/` or empty)

---

### Step 3: Add Cloudflare Environment Variables
1. Once the project is created in Cloudflare Pages, go to **Settings** > **Environment variables**.
2. Click **Add variables** under **Production** (and Preview if needed):
   - `SENDGRID_API_KEY`: *(Paste your SendGrid API Key starting with `SG.`)*
   - `TO_EMAIL`: `support@theurbanphysio.com` *(The doctor's email where enquiries should arrive)*
   - `FROM_EMAIL`: `your-verified-sender@domain.com` *(The verified sender email from Step 1)*
3. Click **Save**.

---

### Step 4: Attach your Subdomain
1. In your Cloudflare Pages project, go to the **Custom domains** tab.
2. Click **Set up a custom domain**.
3. Enter your desired subdomain (e.g., `enquiry.theurbanphysio.com` or `consult.theurbanphysio.com`).
4. Since your root domain is already on Cloudflare, Cloudflare will automatically configure the DNS CNAME and issue a free SSL certificate.
5. Your form is now live and fully operational!

