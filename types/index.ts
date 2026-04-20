// Shared TypeScript types mirroring the Prisma schema.
// Use these in components, API handlers, and service functions.

// ─── Enums ───────────────────────────────────────────────────────────────────

export type Role = "CLIENT" | "PM" | "ADMIN";

export type PaymentType = "RETAINER" | "SUCCESS" | "OTHER";

export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED";

export type PaymentProvider = "PAYSTACK" | "MANUAL" | "OTHER";

// ─── Domain Types ─────────────────────────────────────────────────────────────

export interface User {
  id: string;
  email: string;
  role: Role;
  createdAt: Date;
  lastLogin: Date | null;
  // Profile — all roles
  fullName: string | null;
  preferredName: string | null;
  phone: string | null;
  photoUrl: string | null;
  // Client-only (nullable for PM/ADMIN)
  nationality: string | null;
  location: string | null;
  idType: string | null;
  idNumber: string | null;
  onboardingComplete: boolean;
  // PM assignment (clients only)
  assignedPmId: string | null;
  pmChangeRequested: boolean;
  pmChangeReason: string | null;
}

export interface Enquiry {
  id: string;
  userId: string;
  source: string | null;
  transactionType: string | null;
  brief: string | null;
  status: string;
  assignedAdvisor: string | null;
  createdAt: Date;
}

export interface Engagement {
  id: string;
  userId: string;
  pmId: string | null;
  serviceTier: string | null;
  stage: string;
  startDate: Date | null;
  targetDate: Date | null;
  status: string;
}

export interface PendingAction {
  id: string;
  engagementId: string;
  title: string;
  type: PendingActionType;
  dueDate: Date | null;
  completedAt: Date | null;
  createdAt: Date;
}

export type PendingActionType =
  | "SIGN_DOCUMENT"
  | "APPROVE_SHORTLIST"
  | "CONFIRM_VISIT"
  | "CONFIRM_BRIEF"
  | "OTHER";

export interface Document {
  id: string;
  engagementId: string;
  name: string;
  category: string | null;
  filePath: string;
  uploadedBy: string;
  uploadedAt: Date;
  version: number;
}

export interface Update {
  id: string;
  engagementId: string;
  pmId: string;
  content: string;
  nextSteps: string | null;
  publishedAt: Date | null;
  draft: boolean;
}

export interface Message {
  id: string;
  engagementId: string;
  senderId: string;
  body: string;
  attachmentPath: string | null;
  sentAt: Date;
  readAt: Date | null;
}

export interface Property {
  id: string;
  engagementId: string;
  address: string | null;
  area: string | null;
  priceAsking: number | null;
  priceEstimated: number | null;
  status: string;
  notes: string | null;
}

export interface Payment {
  id: string;
  engagementId: string;
  type: PaymentType;
  amount: number;
  currency: string;
  provider: PaymentProvider;
  status: PaymentStatus;
  reference: string | null;
  paidAt: Date | null;
  createdAt: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: string;
  content: string;
  read: boolean;
  createdAt: Date;
}

export interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string | null;
  timestamp: Date;
  ipAddress: string | null;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface ApiError {
  error: string;
}

// ─── Portal / Dashboard Types ────────────────────────────────────────────────

export type EngagementStage =
  | "discovery"
  | "brief_confirmation"
  | "area_shortlisting"
  | "property_search"
  | "due_diligence"
  | "offer_negotiation"
  | "legal_completion"
  | "handover";

export interface PMProfile {
  id: string;
  fullName: string | null;
  email: string;
  phone: string | null;
  photoUrl: string | null;
}

export interface DashboardData {
  engagement: Engagement;
  latestUpdate: Update | null;
  pendingActions: PendingAction[];
  pm: PMProfile | null;
}

// ─── API Response Types ───────────────────────────────────────────────────────

export interface SignupResponse {
  message: string;
  user: Pick<User, "id" | "email" | "role">;
}

export interface LoginResponse {
  user: Pick<User, "id" | "email" | "role">;
  session: { expiresAt: number | undefined };
}

export interface PaymentInitResponse {
  paymentId: string;
  reference: string;
  authorizationUrl: string;
}

export interface PaymentVerifyResponse {
  status: PaymentStatus;
  amount: number;
  currency: string;
  paidAt: Date | null;
  paymentId: string;
}
