const BASE_STYLE = `
  font-family: Inter, ui-sans-serif, system-ui, -apple-system, sans-serif;
  background: #f9fafb;
  margin: 0;
  padding: 0;
`;

const CARD_STYLE = `
  background: #ffffff;
  border-radius: 12px;
  border: 1px solid #d3d1c7;
  padding: 32px;
  max-width: 560px;
  margin: 40px auto;
`;

const HEADING_STYLE = `
  font-family: 'Playfair Display', Georgia, serif;
  font-size: 22px;
  font-weight: 700;
  color: #111d4e;
  margin: 0 0 8px 0;
`;

const BODY_STYLE = `
  font-size: 14px;
  color: #5f5e5a;
  line-height: 1.7;
  margin: 0 0 16px 0;
`;

const CTA_STYLE = `
  display: inline-block;
  background: #111d4e;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
`;

const LOGO = `<span style="font-family:'Playfair Display',Georgia,serif;font-size:20px;font-weight:700;color:#111d4e;">Terra<span style="color:#9b1c2e;">lume</span></span>`;

const FOOTER = `
  <p style="font-size:12px;color:#5f5e5a;text-align:center;margin-top:24px;padding-top:16px;border-top:1px solid #d3d1c7;">
    © ${new Date().getFullYear()} Terralume Advisory · Lagos, Nigeria<br/>
    You received this because you have an active engagement with Terralume.
  </p>
`;

// ─── Templates ───────────────────────────────────────────────────────────────

export function newUpdateEmailHtml({
  clientName,
  content,
  nextSteps,
  portalUrl,
}: {
  clientName: string;
  content: string;
  nextSteps: string | null;
  portalUrl: string;
}): string {
  const nextStepsBlock = nextSteps
    ? `<div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Next steps</p>
        ${nextSteps
          .split("\n")
          .filter(Boolean)
          .map((s) => `<p style="${BODY_STYLE}margin:0 0 6px 0;">→ ${s}</p>`)
          .join("")}
       </div>`
    : "";

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">New update on your search</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, your project manager has posted a new update.</p>
        <div style="background:#f9fafb;border-radius:8px;border:1px solid #d3d1c7;padding:16px;margin:16px 0;">
          <p style="${BODY_STYLE}margin:0;">${content}</p>
        </div>
        ${nextStepsBlock}
        <a href="${portalUrl}" style="${CTA_STYLE}">View in portal</a>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function intakeConfirmationEmailHtml({
  clientName,
  referenceNumber,
  transactionType,
  isNewUser,
}: {
  clientName: string;
  referenceNumber: string;
  transactionType: string;
  isNewUser: boolean;
}): string {
  const typeLabel =
    transactionType === "rent"
      ? "Rental"
      : transactionType === "buy"
        ? "Purchase"
        : transactionType === "lease"
          ? "Commercial Lease"
          : transactionType;

  const accountNote = isNewUser
    ? `<div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 6px 0;">Account created</p>
        <p style="${BODY_STYLE}margin:0;">A Terralume client portal account has been created for you. Check your inbox for a separate email with your account setup link.</p>
       </div>`
    : "";

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Enquiry received</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, thank you for submitting your brief to Terralume. We have received your enquiry and an advisor will review it and contact you within 48 hours to schedule your discovery call.</p>
        <div style="text-align:center;margin:24px 0;">
          <p style="font-size:12px;font-weight:600;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Your reference number</p>
          <div style="display:inline-block;background:#eef0f8;border-radius:20px;padding:10px 28px;">
            <span style="font-size:18px;font-weight:700;color:#111d4e;letter-spacing:0.04em;">${referenceNumber}</span>
          </div>
        </div>
        <div style="background:#f9fafb;border:1px solid #d3d1c7;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Enquiry summary</p>
          <p style="${BODY_STYLE}margin:0;"><strong>Type:</strong> ${typeLabel}</p>
        </div>
        ${accountNote}
        <p style="${BODY_STYLE}">If you have any urgent questions before your call, you can reach us on WhatsApp or reply to this email.</p>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function welcomeEmailHtml({
  clientName,
  loginUrl,
}: {
  clientName: string;
  loginUrl: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Welcome to your client portal</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, your Terralume client portal is ready.</p>
        <p style="${BODY_STYLE}">Click below to set your password and review your brief. Your property search journey starts here.</p>
        <a href="${loginUrl}" style="${CTA_STYLE}">Access your portal</a>
        <p style="${BODY_STYLE}margin-top:16px;">This link expires in 24 hours. If you didn't request this, please ignore this email.</p>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function consultationConfirmationEmailHtml({
  clientName,
}: {
  clientName: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">We've received your request</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, thank you for reaching out to Terralume.</p>
        <p style="${BODY_STYLE}">A member of our team will be in touch within <strong>12–24 hours</strong> to schedule your free consultation. During the call, we'll discuss your objectives, walk you through our service structure, and help determine the best path forward.</p>
        <div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">What to expect</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ PM assigned within 12–24 hours</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Calendar link sent to schedule your free consultation</p>
          <p style="${BODY_STYLE}margin:0;">→ No commitment required — the consultation is entirely free</p>
        </div>
        <p style="${BODY_STYLE}">In the meantime, feel free to explore our <a href="https://terralume.com/how-it-works" style="color:#111d4e;font-weight:600;">how it works</a> page for more detail.</p>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function internalLeadAlertEmailHtml({
  fullName,
  phone,
  email,
  location,
  interestType,
}: {
  fullName: string;
  phone: string;
  email: string;
  location?: string | null;
  interestType?: string | null;
}): string {
  const interestLabel = interestType
    ? interestType.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
    : "Not specified";

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">New consultation request</h1>
        <p style="${BODY_STYLE}">A new lead has submitted a free consultation request on the website.</p>
        <div style="background:#f9fafb;border:1px solid #d3d1c7;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 12px 0;">Lead details</p>
          <p style="${BODY_STYLE}margin:0 0 6px 0;"><strong>Name:</strong> ${fullName}</p>
          <p style="${BODY_STYLE}margin:0 0 6px 0;"><strong>Phone:</strong> ${phone}</p>
          <p style="${BODY_STYLE}margin:0 0 6px 0;"><strong>Email:</strong> ${email}</p>
          <p style="${BODY_STYLE}margin:0 0 6px 0;"><strong>Location:</strong> ${location ?? "Not provided"}</p>
          <p style="${BODY_STYLE}margin:0;"><strong>Interest:</strong> ${interestLabel}</p>
        </div>
        <a href="https://terralume.com/admin-portal/leads" style="${CTA_STYLE}">View in admin portal</a>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function calendarInvitationEmailHtml({
  clientName,
  pmName,
  calendarUrl,
}: {
  clientName: string;
  pmName: string;
  calendarUrl: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Schedule your free consultation</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, I'm ${pmName} — your dedicated project manager at Terralume.</p>
        <p style="${BODY_STYLE}">I'd love to connect for your free consultation. Use the link below to pick a time that works best for you.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${calendarUrl}" style="${CTA_STYLE}">Book your consultation</a>
        </div>
        <p style="${BODY_STYLE}">During the session we will:</p>
        <div style="background:#f9fafb;border-radius:8px;border:1px solid #d3d1c7;padding:16px;margin:0 0 16px 0;">
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Understand your investment or property objective</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Discuss budget and risk appetite</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Explain how Terralume's structured process works</p>
          <p style="${BODY_STYLE}margin:0;">→ Address any legal, tax, or cross-border considerations</p>
        </div>
        <p style="${BODY_STYLE}">No commitment required — this is completely free of charge.</p>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function intakeInvitationEmailHtml({
  clientName,
  setupLink,
}: {
  clientName: string;
  setupLink: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Your portal is ready — let's begin</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, following your consultation with the Terralume team, we're pleased to invite you to complete your structured intake.</p>
        <p style="${BODY_STYLE}">Click below to set your password and access your secure client portal where you can complete your intake form, upload documents, and message your project manager directly.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${setupLink}" style="${CTA_STYLE}">Access your portal</a>
        </div>
        <div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Inside your portal</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Structured intake form (save &amp; continue at any time)</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Secure document upload</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Direct messaging with your project manager</p>
          <p style="${BODY_STYLE}margin:0;">→ Deal dashboard &amp; progress tracker</p>
        </div>
        <p style="${BODY_STYLE}">This link expires in 7 days. If you have any questions, reply to this email or contact your project manager directly.</p>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function strategyMeetingEmailHtml({
  clientName,
  pmName,
  scheduledAt,
  meetingLink,
  notes,
  portalUrl,
}: {
  clientName: string;
  pmName: string;
  scheduledAt: Date;
  meetingLink: string | null;
  notes: string | null;
  portalUrl: string;
}): string {
  const formattedDate = new Date(scheduledAt).toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const formattedTime = new Date(scheduledAt).toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const linkBlock = meetingLink
    ? `<div style="text-align:center;margin:24px 0;">
        <a href="${meetingLink}" style="${CTA_STYLE}">Join Meeting</a>
       </div>`
    : "";

  const notesBlock = notes
    ? `<div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
        <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Session notes</p>
        <p style="${BODY_STYLE}margin:0;">${notes}</p>
       </div>`
    : "";

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Your strategy meeting is confirmed</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, your strategy session with ${pmName} has been scheduled.</p>
        <div style="background:#f9fafb;border:1px solid #d3d1c7;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Meeting details</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;"><strong>Date:</strong> ${formattedDate}</p>
          <p style="${BODY_STYLE}margin:0;"><strong>Time:</strong> ${formattedTime}</p>
        </div>
        ${linkBlock}
        ${notesBlock}
        <p style="${BODY_STYLE}">During this session we will present your options, discuss market analysis, explain risk exposure, and propose an investment structure. Your preferences will be confirmed.</p>
        <a href="${portalUrl}" style="${CTA_STYLE}">View your portal</a>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function agreementReadyEmailHtml({
  clientName,
  portalUrl,
  feeAmount,
  currency,
}: {
  clientName: string;
  portalUrl: string;
  feeAmount: number;
  currency: string;
}): string {
  const formattedFee = `${currency} ${feeAmount.toLocaleString()}`;

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Your service agreement is ready</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, your formal service agreement has been prepared and is ready for your review and signature.</p>
        <div style="background:#f9fafb;border:1px solid #d3d1c7;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Agreement summary</p>
          <p style="${BODY_STYLE}margin:0;"><strong>Agreed fee:</strong> ${formattedFee}</p>
        </div>
        <p style="${BODY_STYLE}">Please log in to your portal, read the agreement carefully, and sign electronically. Once signed and payment is confirmed, you will be formally onboarded as an active client.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${portalUrl}" style="${CTA_STYLE}">Review &amp; Sign Agreement</a>
        </div>
        <p style="${BODY_STYLE}">If you have any questions about the terms, please message your project manager directly from your portal.</p>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function invoiceIssuedEmailHtml({
  clientName,
  invoiceNumber,
  description,
  amount,
  currency,
  dueDate,
  portalUrl,
}: {
  clientName: string;
  invoiceNumber: string;
  description: string;
  amount: number;
  currency: string;
  dueDate: Date | null;
  portalUrl: string;
}): string {
  const formattedAmount = `${currency} ${amount.toLocaleString()}`;
  const dueLine = dueDate
    ? `<p style="${BODY_STYLE}margin:0;"><strong>Due date:</strong> ${new Date(dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}</p>`
    : "";

  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Invoice ${invoiceNumber}</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, an invoice has been issued for your Terralume engagement.</p>
        <div style="background:#f9fafb;border:1px solid #d3d1c7;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Invoice details</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;"><strong>Reference:</strong> ${invoiceNumber}</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;"><strong>Description:</strong> ${description}</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;"><strong>Amount:</strong> ${formattedAmount}</p>
          ${dueLine}
        </div>
        <p style="${BODY_STYLE}">Please log in to your portal to pay securely online.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${portalUrl}" style="${CTA_STYLE}">Pay Now</a>
        </div>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function engagementActivatedEmailHtml({
  clientName,
  portalUrl,
}: {
  clientName: string;
  portalUrl: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Your engagement has started</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, your intake has been reviewed and your engagement is now active. Your dedicated project manager will be in touch shortly to get things moving.</p>
        <div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">What's available now</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Track your property search progress on your dashboard</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Message your project manager directly</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Review and sign your service agreement</p>
          <p style="${BODY_STYLE}margin:0;">→ Access documents and updates in real time</p>
        </div>
        <div style="text-align:center;margin:24px 0;">
          <a href="${portalUrl}" style="${CTA_STYLE}">Open your dashboard</a>
        </div>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function onboardingCompleteEmailHtml({
  clientName,
  portalUrl,
}: {
  clientName: string;
  portalUrl: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">Welcome — you're now an active client</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, your payment has been confirmed and your service agreement is signed. Your onboarding is complete.</p>
        <div style="background:#eef0f8;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Your portal is now fully active</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Track deal progress on your dashboard</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ View and download all your documents</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;">→ Communicate directly with your project manager</p>
          <p style="${BODY_STYLE}margin:0;">→ Monitor compliance and financial milestones</p>
        </div>
        <p style="${BODY_STYLE}">Your dedicated project manager will be in touch shortly with your first update. Everything from here moves transparently inside your dashboard.</p>
        <div style="text-align:center;margin:24px 0;">
          <a href="${portalUrl}" style="${CTA_STYLE}">Go to your dashboard</a>
        </div>
        ${FOOTER}
      </div>
    </div>
  `;
}

export function newDocumentEmailHtml({
  clientName,
  documentName,
  category,
  portalUrl,
}: {
  clientName: string;
  documentName: string;
  category: string;
  portalUrl: string;
}): string {
  return `
    <div style="${BASE_STYLE}">
      <div style="${CARD_STYLE}">
        <p style="margin:0 0 24px 0;">${LOGO}</p>
        <h1 style="${HEADING_STYLE}">New document available</h1>
        <p style="${BODY_STYLE}">Hi ${clientName}, a new document has been added to your Terralume portal.</p>
        <div style="background:#f9fafb;border:1px solid #d3d1c7;border-radius:8px;padding:16px;margin:16px 0;">
          <p style="font-size:12px;font-weight:700;text-transform:uppercase;letter-spacing:0.08em;color:#5f5e5a;margin:0 0 8px 0;">Document details</p>
          <p style="${BODY_STYLE}margin:0 0 4px 0;"><strong>Name:</strong> ${documentName}</p>
          <p style="${BODY_STYLE}margin:0;"><strong>Category:</strong> ${category || "General"}</p>
        </div>
        <a href="${portalUrl}" style="${CTA_STYLE}">View in portal</a>
        ${FOOTER}
      </div>
    </div>
  `;
}
