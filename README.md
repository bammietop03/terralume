# Terralume Platform — User Flow

This document describes the end-to-end journey from first contact to deal completion on the Terralume property-acquisition platform.

---

## Overview

The platform connects property-acquisition clients with Property Managers (PMs) through a structured 4-role system:

| Role                      | Description                                                            |
| ------------------------- | ---------------------------------------------------------------------- |
| **Lead**                  | Prospective client who has enquired via the website                    |
| **Client**                | Active user with a linked portal account                               |
| **PM** (Property Manager) | Staff member who manages client engagements                            |
| **Admin / Super-Admin**   | Full platform access; manages PMs, activates clients, handles finances |

---

## Phase 1 — Lead Acquisition

1. Visitor fills the **Consultation Form** (`/consultation`) on the marketing site.
2. A `Lead` record is created and admin sees it in **Leads** (`/admin-portal/leads`).
3. Admin reviews the lead, optionally assigns a PM, and sends a calendar booking link to schedule a call.
4. Audit events: `LEAD_PM_ASSIGNED`, `CALENDAR_LINK_SENT`.

---

## Phase 2 — Intake

### 2.1 Admin creates the client account

1. Admin or PM opens the lead detail page and clicks **Proceed with intake**.
2. This creates a client portal account (`role: CLIENT`) for the lead and emails them a secure login link.
3. The lead's `status` advances to `INTAKE_INVITED`.
4. Audit event: `INTAKE_INVITATION_SENT`.

### 2.2 Client completes the intake form

1. Client clicks the link in the email and logs into their portal.
2. Client navigates to **My Briefs** (`/client-portal/intake`) and opens the intake form.
3. The multi-step form is pre-filled with their profile details. Client completes and submits it.
4. An `IntakeSubmission` record is created with `status: "PENDING"`.
5. Audit event: `INTAKE_SUBMITTED`.

---

## Phase 3 — Intake Review & Client Activation

### 3.1 Admin reviews the intake

1. Admin views the submission in **Intake Forms** (`/admin-portal/intake`).
2. Status can be progressed: `PENDING → REVIEWING → ACTIVE / CLOSED`.
3. Super-Admin assigns a PM to the client from the intake detail page (`assignPM` action).
4. Audit events: `INTAKE_STATUS_CHANGED`, `PM_ASSIGNED`.

### 3.2 Activating the client

1. From the intake detail page, admin clicks **Activate →** (`/admin-portal/intake/[id]/activate`).
2. Admin selects the **service tier** (Essential / Premium / Elite), **start date**, and optional **target date**.
3. An `Engagement` record is created (`stage: "discovery"`, `status: "active"`).
4. The `IntakeSubmission.status` is set to `ACTIVE`.
5. Client receives an in-app notification and a welcome email.
6. Audit event: `ENGAGEMENT_CREATED`.

---

## Phase 4 — Onboarding

### 4.1 Admin prepares onboarding

1. Admin creates a `ServiceAgreement` for the engagement and sends it to the client.
2. Admin creates one or more `Invoice` records (payment types: `RETAINER`, `SUCCESS`, `OTHER`) and sends them.
3. Optionally, admin schedules a `StrategyMeeting` with a Calendly/Google Meet link.
4. Audit events: `AGREEMENT_CREATED`, `INVOICE_CREATED`, `INVOICE_SENT`, `MEETING_SCHEDULED`.

### 4.2 Client completes onboarding

1. Client signs the service agreement in the portal (`/client-portal/agreement`).
2. Client pays the retainer invoice via **Paystack** (`/client-portal/payments`).
3. Audit events: `AGREEMENT_SIGNED`, `INVOICE_PAID`.

### 4.3 Onboarding completion (`maybeCompleteOnboarding`)

Triggered automatically after each signature and payment.

**Conditions:** `ServiceAgreement.status === "SIGNED"` **and** at least one `Invoice.status === "PAID"`.

When both are met:

1. `User.onboardingComplete` → `true`
2. `Engagement.stage` → `active_client`
3. Client receives an in-app notification and congratulations email.
4. Audit event: `ONBOARDING_COMPLETE`.

---

## Phase 5 — Active Engagement

**Admin / PM side**

- Advance the engagement stage via **Engagements** (`/admin-portal/engagements`). Each transition notifies the client. Audit event: `ENGAGEMENT_STAGE_UPDATED`.
- Publish written progress updates visible to the client.
- Upload documents (search reports, title deeds, etc.). Audit event: `DOCUMENT_UPLOADED`.
- Message the client via real-time chat (Supabase Realtime). Audit event: `MESSAGE_SENT`.

**Client side** — tracked at **My Engagement** (`/client-portal/engagement`):

- Stage progress bar, milestone cards, PM contact bar, full update history.

**Stage progression:**

| #   | Stage key            | Label               |
| --- | -------------------- | ------------------- |
| 1   | `discovery`          | Discovery           |
| 2   | `brief_confirmation` | Brief Confirmation  |
| 3   | `area_shortlisting`  | Area Shortlisting   |
| 4   | `property_search`    | Property Search     |
| 5   | `due_diligence`      | Due Diligence       |
| 6   | `offer_negotiation`  | Offer & Negotiation |
| 7   | `legal_completion`   | Legal & Completion  |
| 8   | `handover`           | Handover            |

> `active_client` is set automatically on onboarding completion and does not appear in the stage tracker.

---

## Phase 6 — Deal Completion

1. PM advances the stage to `handover` and uploads final handover documents.
2. PM publishes a final update summarising the deal.
3. Admin closes the engagement (`Engagement.status → "closed"`).

---

## Audit Trail

Every significant action is recorded in the `AuditLog` table and is visible to Super-Admins at **Settings → Audit Log** (`/admin-portal/settings/audit-log`).

Logged events include:
`USER_CREATED`, `USER_UPDATED`, `USER_DELETED`, `PROFILE_UPDATED`, `PASSWORD_CHANGED`, `INTAKE_SUBMITTED`, `INTAKE_STATUS_CHANGED`, `INTAKE_INVITATION_SENT`, `PM_ASSIGNED`, `PM_CHANGE_REQUESTED`, `LEAD_STATUS_CHANGED`, `LEAD_PM_ASSIGNED`, `CALENDAR_LINK_SENT`, `ENGAGEMENT_CREATED`, `ENGAGEMENT_STAGE_UPDATED`, `AGREEMENT_CREATED`, `AGREEMENT_SIGNED`, `INVOICE_CREATED`, `INVOICE_SENT`, `INVOICE_PAID`, `MEETING_SCHEDULED`, `DOCUMENT_UPLOADED`, `MESSAGE_SENT`, `UPDATE_PUBLISHED`, `ONBOARDING_COMPLETE`.

---

## Technical Architecture

| Layer          | Technology                               |
| -------------- | ---------------------------------------- |
| Framework      | Next.js 15 (App Router)                  |
| Database       | PostgreSQL via Supabase                  |
| ORM            | Prisma                                   |
| Auth           | Custom session-based (Supabase Postgres) |
| Real-time chat | Supabase Realtime (`postgres_changes`)   |
| Payments       | Paystack                                 |
| Email          | Nodemailer / custom HTML templates       |
| UI             | shadcn/ui + Tailwind CSS                 |
| File storage   | Supabase Storage                         |

---

## Development

```bash
npm install
npm run dev
```

Sync the database schema:

```bash
npx prisma db push
```

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
