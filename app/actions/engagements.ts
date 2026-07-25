"use server";

import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdmin, getSessionUser } from "./auth";
import { ProjectService, WorkflowService } from "@/services";
import { createNotification } from "./notifications";
import { logAudit } from "./audit";

// ── Types ──────────────────────────────────────────────────────────────────

// Define the include object for getEngagements
const engagementListInclude = {
  user: {
    select: {
      id: true,
      fullName: true,
      preferredName: true,
      email: true,
      phone: true,
    },
  },
  pm: {
    select: {
      id: true,
      fullName: true,
      preferredName: true,
    },
  },
  service: {
    select: {
      name: true,
      slug: true,
      type: true,
    },
  },
  workflowTemplate: {
    select: {
      name: true,
    },
  },
  _count: {
    select: {
      tasks: true,
    },
  },
} satisfies Prisma.EngagementInclude;

export type EngagementListItem = Prisma.EngagementGetPayload<{
  include: typeof engagementListInclude;
}>;

export type EngagementWithDetails = Awaited<
  ReturnType<typeof getEngagementById>
>;

// ── Admin/PM: Create engagement from intake submission ────────────────────

export async function createEngagementFromIntake(params: {
  intakeSubmissionId: string;
  pmId?: string;
}): Promise<{ success: boolean; engagementId?: string; error?: string }> {
  const admin = await requireAdmin();
  const { intakeSubmissionId, pmId } = params;

  try {
    // Get intake submission with service information
    const intake = await prisma.intakeSubmission.findUnique({
      where: { id: intakeSubmissionId },
      select: {
        id: true,
        userId: true,
        selectedServices: true,
        referenceNumber: true,
        user: {
          select: {
            fullName: true,
            preferredName: true,
          },
        },
      },
    });

    if (!intake) {
      return { success: false, error: "Intake submission not found" };
    }

    // Check if engagement already exists for this intake
    const existingEngagement = await prisma.engagement.findFirst({
      where: { intakeSubmissionId },
    });

    if (existingEngagement) {
      return {
        success: false,
        error: "Engagement already exists for this intake",
      };
    }

    // Map service slugs to service IDs
    const services = await prisma.service.findMany({
      where: {
        slug: { in: intake.selectedServices },
        isActive: true,
      },
      select: { id: true, slug: true },
    });

    if (services.length === 0) {
      return {
        success: false,
        error: "No valid services found for selected services",
      };
    }

    const serviceIds = services.map((s) => s.id);

    // Create engagement using ProjectService
    const engagementId = await ProjectService.createEngagementFromIntake({
      intakeSubmissionId,
      clientId: intake.userId || "",
      pmId,
      serviceIds,
    });

    // Update intake status
    await prisma.intakeSubmission.update({
      where: { id: intakeSubmissionId },
      data: { status: "ACTIVE" },
    });

    // Notify client
    const clientName = intake.user?.preferredName || intake.user?.fullName;
    await createNotification({
      userId: intake.userId || "",
      type: "ENGAGEMENT_CREATED",
      content: `Your project has been created. Your advisor will be in touch shortly.`,
    });

    // Notify PM if assigned
    if (pmId) {
      await createNotification({
        userId: pmId,
        type: "ENGAGEMENT_CREATED",
        content: `New project assigned: ${clientName} (${intake.referenceNumber})`,
      });
    }

    void logAudit(admin.id, "ENGAGEMENT_CREATED", "Engagement", engagementId, {
      intakeSubmissionId,
      pmId,
    });

    revalidatePath("/admin-portal/intake");
    revalidatePath("/admin-portal/engagements");
    revalidatePath("/client-portal/dashboard");

    return { success: true, engagementId };
  } catch (error) {
    console.error("Error creating engagement:", error);
    return {
      success: false,
      error: "Failed to create engagement. Please try again.",
    };
  }
}

// ── Get all engagements (Admin/PM) ────────────────────────────────────────

export async function getEngagements() {
  const sessionUser = await requireAdmin();

  const where = sessionUser.role === "PM" ? { pmId: sessionUser.id } : {}; // Admins see all

  return prisma.engagement.findMany({
    where,
    include: engagementListInclude,
    orderBy: { createdAt: "desc" },
  });
}

// ── Get single engagement details ─────────────────────────────────────────

export async function getEngagementById(id: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return null;

  const engagement = await prisma.engagement.findUnique({
    where: { id },
    select: {
      id: true,
      userId: true,
      pmId: true,
      status: true,
      stage: true,
      intakeSubmissionId: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
          phone: true,
          location: true,
          role: true,
        },
      },
      pm: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
          phone: true,
          photoUrl: true,
        },
      },
      service: true,
      workflowTemplate: {
        include: {
          stages: {
            orderBy: { order: "asc" },
          },
        },
      },
      projectStages: {
        include: {
          workflowStage: true,
        },
        orderBy: { order: "asc" },
      },
      intakeSubmission: {
        select: {
          referenceNumber: true,
          selectedServices: true,
          transactionType: true,
          purpose: true,
          targetAreas: true,
          budgetMin: true,
          budgetMax: true,
          currency: true,
        },
      },
      tasks: {
        include: {
          assignee: {
            select: {
              fullName: true,
              preferredName: true,
            },
          },
          submission: true,
        },
        orderBy: { createdAt: "desc" },
        take: 10,
      },
    },
  });

  if (!engagement) return null;

  // Authorization check
  if (sessionUser.role === "CLIENT" && engagement.userId !== sessionUser.id) {
    return null;
  }

  if (sessionUser.role === "PM" && engagement.pmId !== sessionUser.id) {
    return null;
  }

  return engagement;
}

// ── Get client's engagement ───────────────────────────────────────────────

export async function getMyEngagement() {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== "CLIENT") return null;

  return prisma.engagement.findMany({
    where: {
      userId: sessionUser.id,
      status: "ACTIVE",
    },
    include: {
      pm: {
        select: {
          id: true,
          fullName: true,
          preferredName: true,
          email: true,
          phone: true,
          photoUrl: true,
        },
      },
      service: true,
      workflowTemplate: {
        include: {
          stages: {
            orderBy: { order: "asc" },
          },
        },
      },
      projectStages: {
        include: {
          workflowStage: true,
        },
        orderBy: { order: "asc" },
      },
      tasks: {
        where: {
          assignedTo: sessionUser.id,
          status: {
            in: ["PENDING", "IN_PROGRESS"],
          },
        },
        include: {
          submission: true,
        },
        orderBy: { dueDate: "asc" },
      },
    },
  });
}

// ── Advance to next stage ─────────────────────────────────────────────────

export async function advanceProjectStage(engagementId: string) {
  const pm = await requireAdmin();

  try {
    await ProjectService.advanceToNextStage(engagementId, pm.id);

    revalidatePath(`/admin-portal/engagements/${engagementId}`);
    revalidatePath("/client-portal/dashboard");

    return { success: true };
  } catch (error) {
    console.error("Error advancing stage:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to advance stage",
    };
  }
}

// ── Assign/reassign PM ────────────────────────────────────────────────────

export async function assignPmToEngagement(engagementId: string, pmId: string) {
  const admin = await requireAdmin();

  try {
    await ProjectService.assignPm(engagementId, pmId, admin.id);

    revalidatePath(`/admin-portal/engagements/${engagementId}`);
    revalidatePath("/admin-portal/engagements");

    return { success: true };
  } catch (error) {
    console.error("Error assigning PM:", error);
    return {
      success: false,
      error: "Failed to assign PM",
    };
  }
}

// ── Get project progress ──────────────────────────────────────────────────

export async function getProjectProgress(engagementId: string) {
  return ProjectService.getProjectProgress(engagementId);
}

// ── Get current stage ─────────────────────────────────────────────────────

export async function getCurrentProjectStage(engagementId: string) {
  return ProjectService.getCurrentStage(engagementId);
}

// ── Get all stages ────────────────────────────────────────────────────────

export async function getAllProjectStages(engagementId: string) {
  return ProjectService.getAllStages(engagementId);
}

// ── Update engagement status ──────────────────────────────────────────────

export async function updateEngagementStatus(
  engagementId: string,
  status: "ACTIVE" | "COMPLETED" | "PAUSED" | "CANCELLED",
) {
  const admin = await requireAdmin();

  const updated = await prisma.engagement.update({
    where: { id: engagementId },
    data: { status },
  });

  void logAudit(
    admin.id,
    "ENGAGEMENT_STATUS_UPDATED",
    "Engagement",
    engagementId,
    {
      status,
    },
  );

  revalidatePath(`/admin-portal/engagements/${engagementId}`);
  revalidatePath("/admin-portal/engagements");

  return updated;
}
