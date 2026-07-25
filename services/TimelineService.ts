/**
 * services/TimelineService.ts
 *
 * Generates timeline data for client-facing project dashboard.
 */

import { prisma } from "@/lib/prisma";
import type { ActivityType } from "@/app/generated/prisma/client";

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: ActivityType;
  description: string;
  actorName?: string;
  actorRole?: string;
  metadata?: Record<string, unknown>;
}

export class TimelineService {
  /**
   * Get activity timeline for an engagement
   */
  static async getEngagementTimeline(
    engagementId: string,
    limit = 50,
  ): Promise<TimelineEvent[]> {
    const activities = await prisma.activityLog.findMany({
      where: { engagementId },
      include: {
        actor: {
          select: {
            fullName: true,
            preferredName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return activities.map((activity) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      type: activity.actionType,
      description: activity.description,
      actorName:
        activity.actor?.preferredName || activity.actor?.fullName || undefined,
      actorRole: activity.actorRole,
      metadata: activity.metadata as Record<string, unknown> | undefined,
    }));
  }

  /**
   * Get recent updates for client dashboard
   */
  static async getRecentUpdates(
    engagementId: string,
    limit = 5,
  ): Promise<TimelineEvent[]> {
    const activities = await prisma.activityLog.findMany({
      where: {
        engagementId,
        NOT: {
          metadata: {
            path: ["internalOnly"],
            equals: true,
          },
        },
      },
      include: {
        actor: {
          select: {
            fullName: true,
            preferredName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
      take: limit,
    });

    return activities.map((activity) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      type: activity.actionType,
      description: activity.description,
      actorName:
        activity.actor?.preferredName || activity.actor?.fullName || undefined,
      actorRole: activity.actorRole,
      metadata: activity.metadata as Record<string, unknown> | undefined,
    }));
  }

  /**
   * Log activity to timeline
   * @param engagementId - The engagement ID
   * @param actorId - The user who performed the action
   * @param actorRole - The role of the actor (CLIENT, PM, ADMIN)
   * @param actionType - The type of activity
   * @param description - Human-readable description
   * @param metadata - Optional JSON metadata
   */
  static async logActivity(params: {
    engagementId: string;
    actorId: string;
    actorRole: string;
    actionType: ActivityType;
    description: string;
    metadata?: Record<string, unknown>;
  }) {
    const {
      engagementId,
      actorId,
      actorRole,
      actionType,
      description,
      metadata,
    } = params;

    try {
      return await prisma.activityLog.create({
        data: {
          engagementId,
          actorId,
          actorRole: actorRole as "CLIENT" | "PM" | "ADMIN",
          actionType,
          description,
          // metadata: metadata || {},
        },
      });
    } catch (error) {
      // Log error but don't throw - activity logging should not break main operations
      console.error("Failed to log activity:", error);
      return null;
    }
  }

  /**
   * Log manual update (PM creating a custom timeline entry)
   */
  static async logManualUpdate(params: {
    engagementId: string;
    pmId: string;
    description: string;
    metadata?: Record<string, unknown>;
  }) {
    const { engagementId, pmId, description, metadata } = params;

    return this.logActivity({
      engagementId,
      actorId: pmId,
      actorRole: "PM",
      actionType: "MANUAL_UPDATE",
      description,
      metadata,
    });
  }

  /**
   * Get stage completion timeline
   */
  static async getStageHistory(engagementId: string) {
    const activities = await prisma.activityLog.findMany({
      where: {
        engagementId,
        actionType: {
          in: ["STAGE_STARTED", "STAGE_COMPLETED"],
        },
      },
      orderBy: { timestamp: "asc" },
    });

    return activities.map((activity) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      type: activity.actionType,
      description: activity.description,
    }));
  }

  /**
   * Get document upload history
   */
  static async getDocumentHistory(engagementId: string) {
    const activities = await prisma.activityLog.findMany({
      where: {
        engagementId,
        actionType: "DOCUMENT_UPLOADED",
      },
      orderBy: { timestamp: "desc" },
      take: 20,
    });

    return activities.map((activity) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      description: activity.description,
      metadata: activity.metadata as Record<string, unknown> | undefined,
    }));
  }

  /**
   * Get task activity timeline
   */
  static async getTaskTimeline(engagementId: string) {
    const activities = await prisma.activityLog.findMany({
      where: {
        engagementId,
        actionType: {
          in: [
            "TASK_CREATED",
            "TASK_SUBMITTED",
            "TASK_APPROVED",
            "TASK_REJECTED",
          ],
        },
      },
      include: {
        actor: {
          select: {
            fullName: true,
            preferredName: true,
            role: true,
          },
        },
      },
      orderBy: { timestamp: "desc" },
    });

    return activities.map((activity) => ({
      id: activity.id,
      timestamp: activity.timestamp,
      type: activity.actionType,
      description: activity.description,
      actorName:
        activity.actor?.preferredName || activity.actor?.fullName || undefined,
      actorRole: activity.actorRole,
      metadata: activity.metadata as Record<string, unknown> | undefined,
    }));
  }

  /**
   * Generate human-readable summary of project progress
   */
  static async getProgressSummary(engagementId: string): Promise<{
    currentStage: string;
    stagesCompleted: number;
    totalStages: number;
    estimatedCompletion?: Date;
    recentMilestones: string[];
  }> {
    const engagement = await prisma.engagement.findUnique({
      where: { id: engagementId },
      include: {
        projectStages: {
          include: {
            workflowStage: true,
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!engagement) {
      throw new Error("Engagement not found");
    }

    const completedStages = engagement.projectStages.filter(
      (ps) => ps.status === "COMPLETED",
    );
    const currentStage = engagement.projectStages.find(
      (ps) => ps.status === "IN_PROGRESS",
    );

    // Get recent milestones (completed stages)
    const recentMilestones = await prisma.activityLog.findMany({
      where: {
        engagementId,
        actionType: "STAGE_COMPLETED",
      },
      orderBy: { timestamp: "desc" },
      take: 3,
    });

    return {
      currentStage: currentStage?.workflowStage.name || engagement.stage,
      stagesCompleted: completedStages.length,
      totalStages: engagement.projectStages.length,
      recentMilestones: recentMilestones.map((m) => m.description),
    };
  }
}
