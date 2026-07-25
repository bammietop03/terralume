/**
 * services/WorkflowService.ts
 *
 * Manages workflow templates and stages.
 */

import { prisma } from "@/lib/prisma";
import type { ServiceType } from "@/app/generated/prisma/client";

export class WorkflowService {
  /**
   * Get all active services
   */
  static async getAllServices() {
    return prisma.service.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
  }

  /**
   * Get service by slug
   */
  static async getServiceBySlug(slug: string) {
    return prisma.service.findUnique({
      where: { slug },
      include: {
        workflowTemplates: {
          where: { isActive: true },
          include: {
            stages: {
              orderBy: { order: "asc" },
            },
          },
        },
      },
    });
  }

  /**
   * Get service by type
   */
  static async getServiceByType(type: ServiceType) {
    return prisma.service.findFirst({
      where: { type, isActive: true },
    });
  }

  /**
   * Get workflow template with stages
   */
  static async getWorkflowTemplate(workflowTemplateId: string) {
    return prisma.workflowTemplate.findUnique({
      where: { id: workflowTemplateId },
      include: {
        service: true,
        stages: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  /**
   * Create a new workflow template (Admin only)
   */
  static async createWorkflowTemplate(params: {
    serviceId: string;
    name: string;
    description?: string;
    stages: Array<{
      name: string;
      description?: string;
      order: number;
      estimatedDays?: number;
    }>;
  }) {
    const { serviceId, name, description, stages } = params;

    // Create workflow template with stages
    return prisma.workflowTemplate.create({
      data: {
        serviceId,
        name,
        description,
        isActive: true,
        stages: {
          create: stages.map((stage) => ({
            name: stage.name,
            description: stage.description,
            order: stage.order,
            estimatedDays: stage.estimatedDays,
          })),
        },
      },
      include: {
        stages: {
          orderBy: { order: "asc" },
        },
      },
    });
  }

  /**
   * Update workflow stage
   */
  static async updateWorkflowStage(
    stageId: string,
    data: {
      name?: string;
      description?: string;
      estimatedDays?: number;
    },
  ) {
    return prisma.workflowStage.update({
      where: { id: stageId },
      data,
    });
  }

  /**
   * Get workflow stages for a service
   */
  static async getServiceWorkflowStages(serviceId: string) {
    const workflowTemplate = await prisma.workflowTemplate.findFirst({
      where: {
        serviceId,
        isActive: true,
      },
      include: {
        stages: {
          orderBy: { order: "asc" },
        },
      },
    });

    return workflowTemplate?.stages || [];
  }

  /**
   * Calculate estimated completion date based on workflow stages
   */
  static async estimateCompletionDate(
    workflowTemplateId: string,
    startDate: Date = new Date(),
  ): Promise<Date> {
    const stages = await prisma.workflowStage.findMany({
      where: { workflowTemplateId },
      orderBy: { order: "asc" },
    });

    const totalDays = stages.reduce(
      (sum, stage) => sum + (stage.estimatedDays || 0),
      0,
    );

    const completionDate = new Date(startDate);
    completionDate.setDate(completionDate.getDate() + totalDays);

    return completionDate;
  }
}
