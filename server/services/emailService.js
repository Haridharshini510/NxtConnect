const { Resend } = require('resend');

const resendApiKey = (process.env.RESEND_API_KEY || '').trim();
const resend = resendApiKey ? new Resend(resendApiKey) : null;
const FROM = process.env.RESEND_FROM_EMAIL || 'NextConnect <onboarding@resend.dev>';

/**
 * Send an email using Resend.
 * All email functions are fire-and-forget — they won't crash the main request if they fail.
 */
const sendEmail = async ({ to, subject, html }) => {
  if (!resend) {
    console.warn('RESEND_API_KEY missing. Skipping email send.');
    return;
  }

  try {
    await resend.emails.send({ from: FROM, to, subject, html });
    console.log(`📧 Email sent to ${to}: ${subject}`);
  } catch (err) {
    console.error('❌ Email send failed:', err.message);
  }
};

// ── Email templates ──────────────────────────────────────────────

const sendConnectionRequestEmail = async ({ toEmail, toName, fromName }) => {
  await sendEmail({
    to: toEmail,
    subject: `${fromName} wants to connect with you on NextConnect`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#2563eb">New Connection Request</h2>
        <p>Hi ${toName},</p>
        <p><strong>${fromName}</strong> has sent you a mentorship request on NextConnect.</p>
        <a href="${process.env.CLIENT_URL}/connections"
           style="display:inline-block;margin-top:16px;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          View Request
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">NextConnect — Bridge the gap between college and career.</p>
      </div>
    `,
  });
};

const sendConnectionAcceptedEmail = async ({ toEmail, toName, mentorName }) => {
  await sendEmail({
    to: toEmail,
    subject: `🎉 ${mentorName} accepted your connection request!`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#16a34a">Connection Accepted!</h2>
        <p>Hi ${toName},</p>
        <p>Great news! <strong>${mentorName}</strong> has accepted your mentorship request. You can now chat with them directly.</p>
        <a href="${process.env.CLIENT_URL}/connections"
           style="display:inline-block;margin-top:16px;padding:10px 20px;background:#16a34a;color:#fff;border-radius:8px;text-decoration:none">
          Start Chatting
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">NextConnect — Bridge the gap between college and career.</p>
      </div>
    `,
  });
};

const sendWorkshopRegistrationEmail = async ({ toEmail, toName, workshopTitle, scheduledAt, meetingLink }) => {
  await sendEmail({
    to: toEmail,
    subject: `You're registered for: ${workshopTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#7c3aed">Workshop Confirmed</h2>
        <p>Hi ${toName},</p>
        <p>You're registered for <strong>${workshopTitle}</strong>.</p>
        <table style="margin-top:16px;border-collapse:collapse;width:100%">
          <tr><td style="padding:8px;color:#6b7280">Date & Time</td><td style="padding:8px;font-weight:600">${new Date(scheduledAt).toLocaleString()}</td></tr>
          ${meetingLink ? `<tr><td style="padding:8px;color:#6b7280">Meeting Link</td><td style="padding:8px"><a href="${meetingLink}" style="color:#7c3aed">${meetingLink}</a></td></tr>` : ''}
        </table>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">NextConnect — Bridge the gap between college and career.</p>
      </div>
    `,
  });
};

const sendWelcomeEmail = async ({ toEmail, toName, role }) => {
  await sendEmail({
    to: toEmail,
    subject: `Welcome to NextConnect, ${toName}!`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#2563eb">Welcome aboard! 🎉</h2>
        <p>Hi ${toName},</p>
        <p>Your ${role} account is ready. ${role === 'student'
          ? 'Start by browsing mentors and sending a connection request.'
          : 'Complete your mentor profile so students can find you.'
        }</p>
        <a href="${process.env.CLIENT_URL}/dashboard"
           style="display:inline-block;margin-top:16px;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          Go to Dashboard
        </a>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">NextConnect — Bridge the gap between college and career.</p>
      </div>
    `,
  });
};

const sendVerificationEmail = async ({ toEmail, toName, verificationUrl }) => {
  await sendEmail({
    to: toEmail,
    subject: 'Verify your email for NxtConnect',
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:auto">
        <h2 style="color:#2563eb">Verify your email</h2>
        <p>Hi ${toName},</p>
        <p>Please confirm your email address to activate your NxtConnect account.</p>
        <a href="${verificationUrl}"
           style="display:inline-block;margin-top:16px;padding:10px 20px;background:#2563eb;color:#fff;border-radius:8px;text-decoration:none">
          Verify email
        </a>
        <p style="margin-top:16px;font-size:13px;color:#6b7280">This link expires in 24 hours.</p>
        <p style="margin-top:24px;color:#6b7280;font-size:13px">NextConnect — Bridge the gap between college and career.</p>
      </div>
    `,
  });
};

module.exports = {
  sendConnectionRequestEmail,
  sendConnectionAcceptedEmail,
  sendWorkshopRegistrationEmail,
  sendWelcomeEmail,
  sendVerificationEmail,
};
