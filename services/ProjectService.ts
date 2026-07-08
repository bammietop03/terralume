/**
 * services/ProjectService.ts
 *
 * Manages project (Engagement) creation, workflow instantiation, and project stage progression.
 */

import { prisma } from "@/lib/prisma";
import type { Prisma } from "@/app/generated/prisma/client";
import { TimelineService } from "@/services/TimelineService";

export class ProjectService {
  /**
   * Create a new engagement from intake submission and instantiate workflow stages
   */
  static async createEngagementFromIntake(params: {
    intakeSubmissionId: string;
    clientId: string;
    pmId?: string;
    serviceIds: string[]; // IDs of selected services
  }): Promise<string> {
    const { intakeSubmissionId, clientId, pmId, serviceIds } = params;

    if (serviceIds.length === 0) {
      throw new Error("At least one service must be selected");
    }

    // Determine service type for engagement
    let primaryServiceId = serviceIds[0];
    let serviceType: "REAL_ESTATE" | "RENEWABLE_ENERGY" | "INTEGRATED" =
      "REAL_ESTATE";

    if (serviceIds.length > 1) {
      // Both services selected = INTEGRATED
      serviceType = "INTEGRATED";
      // Use Real Estate workflow as primary for integrated projects
      const realEstateService = await prisma.service.findFirst({
        where: { type: "REAL_ESTATE", isActive: true },
      });
      if (realEstateService) {
        primaryServiceId = realEstateService.id;
      }
    } else {
      // Single service - get its type
      const service = await prisma.service.findUnique({
        where: { id: primaryServiceId },
      });
      if (service) {
        serviceType = service.type;
      }
    }

    // Get active workflow template for primary service
    const workflowTemplate = await prisma.workflowTemplate.findFirst({
      where: {
        serviceId: primaryServiceId,
        isActive: true,
      },
      include: {
        stages: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!workflowTemplate) {
      throw new Error(
        `No active workflow found for service ${primaryServiceId}`,
      );
    }

    // Create engagement with workflow reference
    const engagement = await prisma.engagement.create({
      data: {
        userId: clientId,
        pmId,
        serviceId: primaryServiceId,
        workflowTemplateId: workflowTemplate.id,
        intakeSubmissionId,
        stage: "Intake Review", // Default to first stage name
        status: "ACTIVE",
      },
    });

    // Instantiate project stages from workflow template
    await this.instantiateProjectStages(engagement.id, workflowTemplate.id);

    // Log project creation
    const service = await prisma.service.findUnique({
      where: { id: primaryServiceId },
      select: { name: true },
    });

    await TimelineService.logActivity({
      engagementId: engagement.id,
      actorId: clientId,
      actorRole: "CLIENT",
      actionType: "PROJECT_CREATED",
      description: `Project created for ${service?.name || "service"}`,
      metadata: { serviceType, serviceIds },
    });

    // Log PM assignment if PM was assigned
    if (pmId) {
      const pm = await prisma.user.findUnique({
        where: { id: pmId },
        select: { fullName: true, preferredName: true },
      });
      const pmName = pm?.preferredName || pm?.fullName || "Project Manager";

      await TimelineService.logActivity({
        engagementId: engagement.id,
        actorId: pmId,
        actorRole: "PM",
        actionType: "PM_ASSIGNED",
        description: `Project Manager assigned: ${pmName}`,
        metadata: { pmId },
      });
    }

    return engagement.id;
  }

  /**
   * Instantiate ProjectStage records from WorkflowTemplate stages
   */
  static async instantiateProjectStages(
    engagementId: string,
    workflowTemplateId: string,
  ): Promise<void> {
    const workflowStages = await prisma.workflowStage.findMany({
      where: { workflowTemplateId },
      orderBy: { order: "asc" },
    });

    for (const stage of workflowStages) {
      await prisma.projectStage.create({
        data: {
          engagementId,
          workflowStageId: stage.id,
          order: stage.order,
          status: stage.order === 1 ? "IN_PROGRESS" : "NOT_STARTED",
          startedAt: stage.order === 1 ? new Date() : null,
        },
      });
    }
  }

  /**
   * Advance project to next stage
   */
  static async advanceToNextStage(
    engagementId: string,
    pmId: string,
  ): Promise<void> {
    const currentStageRecord = await prisma.projectStage.findFirst({
      where: {
        engagementId,
        status: "IN_PROGRESS",
      },
      include: {
        workflowStage: true,
      },
    });

    if (!currentStageRecord) {
      throw new Error("No in-progress stage found for this engagement");
    }

    // Complete current stage
    await prisma.projectStage.update({
      where: { id: currentStageRecord.id },
      data: {
        status: "COMPLETED",
        completedAt: new Date(),
      },
    });

    // Log completion
    await TimelineService.logActivity({
      engagementId,
      actorId: pmId,
      actorRole: "PM",
      actionType: "STAGE_COMPLETED",
      description: `Completed stage: ${currentStageRecord.workflowStage.name}`,
      metadata: {
        stageId: currentStageRecord.id,
        stageName: currentStageRecord.workflowStage.name,
      },
    });

    // Start next stage if it exists
    const nextStage = await prisma.projectStage.findFirst({
      where: {
        engagementId,
        order: currentStageRecord.order + 1,
      },
      include: {
        workflowStage: true,
      },
    });

    if (nextStage) {
      await prisma.projectStage.update({
        where: { id: nextStage.id },
        data: {
          status: "IN_PROGRESS",
          startedAt: new Date(),
        },
      });

      // Update engagement stage field (deprecated but still in use)
      await prisma.engagement.update({
        where: { id: engagementId },
        data: {
          stage: nextStage.workflowStage.name,
        },
      });

      // Log new stage started
      await TimelineService.logActivity({
        engagementId,
        actorId: pmId,
        actorRole: "PM",
        actionType: "STAGE_STARTED",
        description: `Started stage: ${nextStage.workflowStage.name}`,
        metadata: {
          stageId: nextStage.id,
          stageName: nextStage.workflowStage.name,
        },
      });
    } else {
      // No more stages - mark engagement as completed
      await prisma.engagement.update({
        where: { id: engagementId },
        data: {
          status: "COMPLETED",
          stage: "Delivered",
        },
      });
    }
  }

  /**
   * Get project progress percentage
   */
  static async getProjectProgress(engagementId: string): Promise<{
    percentage: number;
    completedStages: number;
    totalStages: number;
  }> {
    const stages = await prisma.projectStage.findMany({
      where: { engagementId },
    });

    if (stages.length === 0) {
      return { percentage: 0, completedStages: 0, totalStages: 0 };
    }

    const completedCount = stages.filter(
      (s) => s.status === "COMPLETED",
    ).length;
    const percentage = Math.round((completedCount / stages.length) * 100);

    return {
      percentage,
      completedStages: completedCount,
      totalStages: stages.length,
    };
  }

  /**
   * Get current project stage details
   */
  static async getCurrentStage(engagementId: string) {
    return prisma.projectStage.findFirst({
      where: {
        engagementId,
        status: "IN_PROGRESS",
      },
      include: {
        workflowStage: true,
      },
    });
  }

  /**
   * Get all project stages for engagement
   */
  static async getAllStages(engagementId: string) {
    return prisma.projectStage.findMany({
      where: { engagementId },
      include: {
        workflowStage: true,
      },
      orderBy: { order: "asc" },
    });
  }

  /**
   * Assign PM to engagement
   */
  static async assignPm(
    engagementId: string,
    pmId: string,
    assignedBy: string,
  ): Promise<void> {
    await prisma.engagement.update({
      where: { id: engagementId },
      data: { pmId },
    });

    // Get PM name for activity log
    const pm = await prisma.user.findUnique({
      where: { id: pmId },
      select: { fullName: true, preferredName: true },
    });
    const pmName = pm?.preferredName || pm?.fullName || "Project Manager";

    await TimelineService.logActivity({
      engagementId,
      actorId: assignedBy,
      actorRole: "ADMIN",
      actionType: "PM_ASSIGNED",
      description: `Project Manager assigned: ${pmName}`,
      metadata: { pmId, pmName },
    });
  }
}
