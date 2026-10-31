/**
 * Cloudflare Pages Function: /api/send-enquiry
 * Supports both:
 * 1. Twilio Direct Comms API (TWILIO_ACCOUNT_SID + TWILIO_AUTH_TOKEN)
 * 2. Twilio SendGrid API (SENDGRID_API_KEY)
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type'
  };

  try {
    const data = await request.json();

    // 1. Validation
    if (!data.fullName || !data.phone || !data.email) {
      return new Response(
        JSON.stringify({ success: false, message: 'Missing required patient details.' }),
        { status: 400, headers }
      );
    }

    // 2. Environment Variables
    const TWILIO_ACCOUNT_SID = env.TWILIO_ACCOUNT_SID;
    const TWILIO_AUTH_TOKEN = env.TWILIO_AUTH_TOKEN;
    const SENDGRID_API_KEY = env.SENDGRID_API_KEY;

    const TO_EMAIL = env.TO_EMAIL || 'hrideshdutt@gmail.com';
    const FROM_EMAIL = env.FROM_EMAIL || 'support@theurbanphysio.com';

    // Check credentials
    const hasTwilioComms = Boolean(TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN);
    const hasSendGrid = Boolean(SENDGRID_API_KEY);

    if (!hasTwilioComms && !hasSendGrid) {
      return new Response(
        JSON.stringify({
          success: false,
          message: 'Twilio credentials not configured in Cloudflare. Please set TWILIO_ACCOUNT_SID & TWILIO_AUTH_TOKEN in Pages Settings.'
        }),
        { status: 500, headers }
      );
    }

    const cleanPhone = (data.phone || '').replace(/[^0-9]/g, '').slice(-10);
    const whatsappLink = `https://wa.me/91${cleanPhone}?text=Hello%20${encodeURIComponent(data.fullName)}%2C%20regarding%20your%20consultation%20enquiry%20at%20The%20Urban%20Physio...`;

    // 3. Email Subject & HTML Template
    const subject = `🩺 New Enquiry: ${data.fullName} - ${data.concernCategory} (${data.preferredDate})`;

    const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f4f6f8; margin: 0; padding: 20px; color: #1e293b; }
        .wrapper { max-width: 650px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: #ffffff; padding: 24px 30px; }
        .header h1 { margin: 0 0 6px; font-size: 22px; font-weight: 700; }
        .header p { margin: 0; font-size: 14px; opacity: 0.9; }
        .badge { display: inline-block; background: #ccfbf1; color: #0f766e; font-size: 11px; font-weight: bold; padding: 3px 8px; border-radius: 99px; text-transform: uppercase; margin-bottom: 8px; }
        .content { padding: 24px 30px; }
        .section-title { font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #0d9488; font-weight: 700; margin: 20px 0 10px; border-bottom: 2px solid #f0fdfa; padding-bottom: 4px; }
        .section-title:first-child { margin-top: 0; }
        .info-table { width: 100%; border-collapse: collapse; margin-bottom: 12px; }
        .info-table td { padding: 8px 10px; font-size: 14px; border-bottom: 1px solid #f1f5f9; }
        .info-table td.label { font-weight: 600; color: #64748b; width: 35%; background: #f8fafc; }
        .info-table td.value { color: #0f172a; }
        .highlight-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 14px 16px; margin: 16px 0; }
        .pain-pill { display: inline-block; padding: 3px 10px; border-radius: 99px; font-weight: bold; font-size: 13px; background: #fef3c7; color: #92400e; }
        .actions { margin-top: 24px; text-align: center; }
        .btn { display: inline-block; padding: 10px 20px; font-size: 14px; font-weight: 600; text-decoration: none; border-radius: 6px; margin: 4px; }
        .btn-call { background: #0d9488; color: #ffffff !important; }
        .btn-whatsapp { background: #25d366; color: #ffffff !important; }
        .footer { background: #f8fafc; padding: 16px 30px; text-align: center; font-size: 12px; color: #94a3b8; border-top: 1px solid #e2e8f0; }
      </style>
    </head>
    <body>
      <div class="wrapper">
        <div class="header">
          <span class="badge">New Patient Enquiry</span>
          <h1>The Urban Physio Consultation Request</h1>
          <p>Submitted via Online Patient Intake Form</p>
        </div>

        <div class="content">
          <!-- 1. Patient Details -->
          <div class="section-title">1. Patient Personal Details</div>
          <table class="info-table">
            <tr>
              <td class="label">Patient Name:</td>
              <td class="value"><strong>${escapeHtml(data.fullName)}</strong></td>
            </tr>
            <tr>
              <td class="label">Phone / Mobile:</td>
              <td class="value"><a href="tel:+91${cleanPhone}">${escapeHtml(data.phone)}</a></td>
            </tr>
            <tr>
              <td class="label">Email Address:</td>
              <td class="value"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
            </tr>
            <tr>
              <td class="label">Age & Gender:</td>
              <td class="value">${escapeHtml(data.age)} Years / ${escapeHtml(data.gender)}</td>
            </tr>
          </table>

          <!-- 2. Address Details -->
          <div class="section-title">2. Full Address Details</div>
          <table class="info-table">
            <tr>
              <td class="label">Street / House:</td>
              <td class="value">${escapeHtml(data.streetAddress)}</td>
            </tr>
            <tr>
              <td class="label">Locality / Landmark:</td>
              <td class="value">${escapeHtml(data.area)}</td>
            </tr>
            <tr>
              <td class="label">City & Pincode:</td>
              <td class="value"><strong>${escapeHtml(data.city)} - ${escapeHtml(data.pincode)}</strong></td>
            </tr>
          </table>

          <!-- 3. Medical Problem & Health History -->
          <div class="section-title">3. Medical Problem & Health History</div>
          <table class="info-table">
            <tr>
              <td class="label">Primary Condition:</td>
              <td class="value"><strong>${escapeHtml(data.concernCategory)}</strong></td>
            </tr>
            <tr>
              <td class="label">Problem Duration:</td>
              <td class="value">${escapeHtml(data.duration)}</td>
            </tr>
            <tr>
              <td class="label">Pain Severity:</td>
              <td class="value"><span class="pain-pill">${escapeHtml(data.painScale)} / 10</span></td>
            </tr>
            <tr>
              <td class="label">Symptoms Description:</td>
              <td class="value" style="white-space: pre-line;">${escapeHtml(data.problemDescription)}</td>
            </tr>
            <tr>
              <td class="label">Past Medical History:</td>
              <td class="value" style="white-space: pre-line;">${escapeHtml(data.pastHistory)}</td>
            </tr>
            <tr>
              <td class="label">Current Medications / Therapy:</td>
              <td class="value">${escapeHtml(data.currentMedication || 'None mentioned')}</td>
            </tr>
          </table>

          <!-- 4. Preferred Appointment -->
          <div class="section-title">4. Appointment Booking Request</div>
          <div class="highlight-box">
            <p style="margin: 0 0 6px; font-size: 15px;"><strong>📅 Date & Day:</strong> ${escapeHtml(data.preferredDate)} (${escapeHtml(data.preferredDay)})</p>
            <p style="margin: 0 0 6px; font-size: 15px;"><strong>⏰ Time Slot:</strong> ${escapeHtml(data.timeSlot)}</p>
            <p style="margin: 0 0 6px; font-size: 15px;"><strong>🏥 Mode:</strong> ${escapeHtml(data.consultationMode)}</p>
            ${data.additionalNotes ? `<p style="margin: 0; font-size: 13px; color: #475569;"><strong>Notes:</strong> ${escapeHtml(data.additionalNotes)}</p>` : ''}
          </div>

          <div class="actions">
            <a href="tel:+91${cleanPhone}" class="btn btn-call">📞 Call Patient</a>
            <a href="${whatsappLink}" target="_blank" class="btn btn-whatsapp">💬 Open WhatsApp</a>
          </div>
        </div>

        <div class="footer">
          <p>© 2026 The Urban Physio • Online Patient Intake Gateway</p>
          <p>Submission Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST</p>
        </div>
      </div>
    </body>
    </html>
    `;

    // 4. Send Email
    let apiResponse;

    if (hasTwilioComms) {
      // Use Twilio Direct Comms API (Account SID + Auth Token)
      const basicAuth = 'Basic ' + btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
      const twilioPayload = {
        from: {
          address: FROM_EMAIL,
          name: 'The Urban Physio'
        },
        to: [
          { address: TO_EMAIL }
        ],
        content: {
          subject: subject,
          html: emailHtml
        }
      };

      apiResponse = await fetch('https://comms.twilio.com/v1/Emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': basicAuth
        },
        body: JSON.stringify(twilioPayload)
      });
    } else {
      // Fallback: SendGrid API
      const sendgridPayload = {
        personalizations: [{ to: [{ email: TO_EMAIL, name: 'The Urban Physio' }], subject: subject }],
        from: { email: FROM_EMAIL, name: 'The Urban Physio' },
        reply_to: { email: data.email, name: data.fullName },
        content: [{ type: 'text/html', value: emailHtml }]
      };

      apiResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${SENDGRID_API_KEY}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(sendgridPayload)
      });
    }

    if (apiResponse.ok || apiResponse.status === 200 || apiResponse.status === 201 || apiResponse.status === 202) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'Patient enquiry submitted and sent to the doctor successfully!'
        }),
        { status: 200, headers }
      );
    } else {
      const errText = await apiResponse.text();
      console.error('Twilio API Error:', apiResponse.status, errText);
      return new Response(
        JSON.stringify({
          success: false,
          message: `Twilio delivery failed (Status ${apiResponse.status})`,
          details: errText
        }),
        { status: 502, headers }
      );
    }
  } catch (error) {
    console.error('Server Error:', error);
    return new Response(
      JSON.stringify({ success: false, message: 'Internal server error occurred.' }),
      { status: 500, headers }
    );
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}

function escapeHtml(str) {
  if (typeof str !== 'string') return String(str || '');
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
