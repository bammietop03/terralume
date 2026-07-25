/**
 * services/TaskService.ts
 *
 * Manages tasks and submissions within engagements.
 */

import { prisma } from "@/lib/prisma";
import type {
  TaskPriority,
  TaskStatus,
  Role,
} from "@/app/generated/prisma/client";
import { TimelineService } from "@/services/TimelineService";

export class TaskService {
  /**
   * Create a new task
   */
  static async createTask(params: {
    engagementId: string;
    assignedTo: string; // User ID
    createdBy: string; // PM/Admin ID
    title: string;
    description?: string;
    dueDate?: Date;
    priority?: TaskPriority;
  }) {
    const {
      engagementId,
      assignedTo,
      createdBy,
      title,
      description,
      dueDate,
      priority,
    } = params;

    const task = await prisma.task.create({
      data: {
        engagementId,
        assignedTo,
        createdBy,
        title,
        description,
        dueDate,
        priority: priority || "MEDIUM",
        status: "PENDING",
      },
    });

    // Log activity
    await TimelineService.logActivity({
      engagementId,
      actorId: createdBy,
      actorRole: "PM",
      actionType: "TASK_CREATED",
      description: `Task created: ${title}`,
      metadata: { taskId: task.id, priority, dueDate: dueDate?.toISOString() },
    });

    return task;
  }

  /**
   * Get tasks for an engagement
   */
  static async getEngagementTasks(engagementId: string) {
    return prisma.task.findMany({
      where: { engagementId },
      include: {
        assignee: {
          select: {
            id: true,
            fullName: true,
            email: true,
            preferredName: true,
          },
        },
        creator: {
          select: {
            id: true,
            fullName: true,
            preferredName: true,
          },
        },
        submission: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Get tasks assigned to a user
   */
  static async getUserTasks(userId: string, status?: TaskStatus) {
    return prisma.task.findMany({
      where: {
        assignedTo: userId,
        ...(status && { status }),
      },
      include: {
        engagement: {
          select: {
            id: true,
            stage: true,
            user: {
              select: {
                fullName: true,
                preferredName: true,
              },
            },
          },
        },
        submission: true,
      },
      orderBy: [{ dueDate: "asc" }, { createdAt: "desc" }],
    });
  }

  /**
   * Submit a task response (client-side)
   */
  static async submitTask(params: {
    taskId: string;
    responseText?: string;
    attachmentPaths?: string[];
  }) {
    const { taskId, responseText, attachmentPaths } = params;

    const task = await prisma.task.findUnique({
      where: { id: taskId },
      include: { engagement: true },
    });

    if (!task) {
      throw new Error("Task not found");
    }

    // Create submission
    const submission = await prisma.taskSubmission.create({
      data: {
        taskId,
        responseText,
        attachmentPaths: attachmentPaths || [],
        submittedAt: new Date(),
        approvalStatus: "PENDING",
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: taskId },
      data: { status: "SUBMITTED" },
    });

    // Log activity
    await TimelineService.logActivity({
      engagementId: task.engagementId,
      actorId: task.assignedTo,
      actorRole: "CLIENT",
      actionType: "TASK_SUBMITTED",
      description: `Task submitted: ${task.title}`,
      metadata: { taskId, submissionId: submission.id },
    });

    return submission;
  }

  /**
   * Approve task submission (PM/Admin)
   */
  static async approveSubmission(params: {
    submissionId: string;
    reviewedBy: string;
    feedback?: string;
  }) {
    const { submissionId, reviewedBy, feedback } = params;

    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: {
        task: {
          include: { engagement: true },
        },
      },
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    // Update submission
    await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        approvalStatus: "APPROVED",
        reviewedBy,
        reviewedAt: new Date(),
        feedback,
      },
    });

    // Update task status
    await prisma.task.update({
      where: { id: submission.taskId },
      data: { status: "APPROVED" },
    });

    // Log activity
    await TimelineService.logActivity({
      engagementId: submission.task.engagementId,
      actorId: reviewedBy,
      actorRole: "PM",
      actionType: "TASK_APPROVED",
      description: `Task approved: ${submission.task.title}`,
      metadata: { taskId: submission.taskId, submissionId, feedback },
    });

    return submission;
  }

  /**
   * Reject task submission (PM/Admin)
   */
  static async rejectSubmission(params: {
    submissionId: string;
    reviewedBy: string;
    feedback: string;
  }) {
    const { submissionId, reviewedBy, feedback } = params;

    const submission = await prisma.taskSubmission.findUnique({
      where: { id: submissionId },
      include: {
        task: {
          include: { engagement: true },
        },
      },
    });

    if (!submission) {
      throw new Error("Submission not found");
    }

    // Update submission
    await prisma.taskSubmission.update({
      where: { id: submissionId },
      data: {
        approvalStatus: "REJECTED",
        reviewedBy,
        reviewedAt: new Date(),
        feedback,
      },
    });

    // Update task status back to IN_PROGRESS so client can resubmit
    await prisma.task.update({
      where: { id: submission.taskId },
      data: { status: "IN_PROGRESS" },
    });

    // Log activity
    await TimelineService.logActivity({
      engagementId: submission.task.engagementId,
      actorId: reviewedBy,
      actorRole: "PM",
      actionType: "TASK_REJECTED",
      description: `Task rejected: ${submission.task.title}`,
      metadata: { taskId: submission.taskId, submissionId, feedback },
    });

    return submission;
  }

  /**
   * Update task
   */
  static async updateTask(
    taskId: string,
    data: {
      title?: string;
      description?: string;
      dueDate?: Date;
      priority?: TaskPriority;
      status?: TaskStatus;
    },
  ) {
    return prisma.task.update({
      where: { id: taskId },
      data,
    });
  }

  /**
   * Delete task
   */
  static async deleteTask(taskId: string) {
    // Delete related submissions first
    await prisma.taskSubmission.deleteMany({
      where: { taskId },
    });

    return prisma.task.delete({
      where: { id: taskId },
    });
  }

  /**
   * Get pending tasks count for engagement
   */
  static async getPendingTasksCount(engagementId: string): Promise<number> {
    return prisma.task.count({
      where: {
        engagementId,
        status: {
          in: ["PENDING", "IN_PROGRESS"],
        },
      },
    });
  }
}
