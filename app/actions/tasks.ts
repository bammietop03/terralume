"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { requireAdmin, requireClient, getSessionUser } from "./auth";
import { TaskService } from "@/services";
import { logAudit } from "./audit";
import { createNotification } from "./notifications";
import type { TaskPriority, TaskStatus } from "@/app/generated/prisma/client";

// ── Admin/PM: Create task ─────────────────────────────────────────────────

export async function createTask(params: {
  engagementId: string;
  assignedTo: string;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: TaskPriority;
}) {
  const pm = await requireAdmin();

  try {
    const task = await TaskService.createTask({
      engagementId: params.engagementId,
      assignedTo: params.assignedTo,
      createdBy: pm.id,
      title: params.title,
      description: params.description,
      dueDate: params.dueDate ? new Date(params.dueDate) : undefined,
      priority: params.priority,
    });

    // Notify client about new task
    await createNotification({
      userId: params.assignedTo,
      type: "task_assigned",
      content: `New task assigned: ${params.title}${params.dueDate ? ` - Due ${new Date(params.dueDate).toLocaleDateString()}` : ""}`,
    });

    revalidatePath(`/admin-portal/engagements/${params.engagementId}`);
    revalidatePath("/client-portal/dashboard");

    void logAudit(pm.id, "TASK_CREATED", "Task", task.id, {
      title: params.title,
      assignedTo: params.assignedTo,
    });

    return { success: true, taskId: task.id };
  } catch (error) {
    console.error("Error creating task:", error);
    return { success: false, error: "Failed to create task" };
  }
}

// ── Get tasks for engagement ──────────────────────────────────────────────

export async function getEngagementTasks(engagementId: string) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return [];

  // Authorization: check user has access to this engagement
  const engagement = await prisma.engagement.findUnique({
    where: { id: engagementId },
    select: { userId: true, pmId: true },
  });

  if (!engagement) return [];

  const hasAccess =
    sessionUser.role === "ADMIN" ||
    engagement.pmId === sessionUser.id ||
    engagement.userId === sessionUser.id;

  if (!hasAccess) return [];

  return TaskService.getEngagementTasks(engagementId);
}

// ── Get user's tasks ──────────────────────────────────────────────────────

export async function getMyTasks(status?: TaskStatus) {
  const sessionUser = await getSessionUser();
  if (!sessionUser) return [];

  return TaskService.getUserTasks(sessionUser.id, status);
}

// ── Client: Submit task ───────────────────────────────────────────────────

export async function submitTask(params: {
  taskId: string;
  responseText?: string;
  attachmentPaths?: string[];
}) {
  const client = await requireClient();

  try {
    const submission = await TaskService.submitTask(params);

    // Revalidate relevant paths
    const task = await prisma.task.findUnique({
      where: { id: params.taskId },
      select: { engagementId: true, title: true, createdBy: true },
    });

    if (task) {
      revalidatePath(`/admin-portal/engagements/${task.engagementId}`);
      revalidatePath("/client-portal/dashboard");

      // Notify PM about task submission
      if (task.createdBy) {
        await createNotification({
          userId: task.createdBy,
          type: "task_submitted",
          content: `Task submitted by client: ${task.title}`,
        });
      }
    }

    void logAudit(client.id, "TASK_SUBMITTED", "Task", params.taskId, {
      submissionId: submission.id,
    });

    return { success: true, submissionId: submission.id };
  } catch (error) {
    console.error("Error submitting task:", error);
    return { success: false, error: "Failed to submit task" };
  }
}

// ── PM/Admin: Approve submission ──────────────────────────────────────────

export async function approveTaskSubmission(params: {
  submissionId: string;
  feedback?: string;
}) {
  const pm = await requireAdmin();

  try {
    const submission = await TaskService.approveSubmission({
      submissionId: params.submissionId,
      reviewedBy: pm.id,
      feedback: params.feedback,
    });

    // Revalidate paths
    if (submission.task) {
      revalidatePath(
        `/admin-portal/engagements/${submission.task.engagementId}`,
      );
      revalidatePath("/client-portal/dashboard");

      // Notify client about task approval
      await createNotification({
        userId: submission.task.assignedTo,
        type: "task_approved",
        content: `Task approved: ${submission.task.title}${params.feedback ? ` - ${params.feedback}` : ""}`,
      });
    }

    void logAudit(
      pm.id,
      "TASK_APPROVED",
      "TaskSubmission",
      params.submissionId,
      {
        taskId: submission.taskId,
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Error approving submission:", error);
    return { success: false, error: "Failed to approve submission" };
  }
}

// ── PM/Admin: Reject submission ───────────────────────────────────────────

export async function rejectTaskSubmission(params: {
  submissionId: string;
  feedback: string;
}) {
  const pm = await requireAdmin();

  try {
    const submission = await TaskService.rejectSubmission({
      submissionId: params.submissionId,
      reviewedBy: pm.id,
      feedback: params.feedback,
    });

    // Revalidate paths
    if (submission.task) {
      revalidatePath(
        `/admin-portal/engagements/${submission.task.engagementId}`,
      );
      revalidatePath("/client-portal/dashboard");

      // Notify client about task rejection
      await createNotification({
        userId: submission.task.assignedTo,
        type: "task_rejected",
        content: `Task needs revision: ${submission.task.title} - ${params.feedback}`,
      });
    }

    void logAudit(
      pm.id,
      "TASK_REJECTED",
      "TaskSubmission",
      params.submissionId,
      {
        taskId: submission.taskId,
        feedback: params.feedback,
      },
    );

    return { success: true };
  } catch (error) {
    console.error("Error rejecting submission:", error);
    return { success: false, error: "Failed to reject submission" };
  }
}

// ── PM/Admin: Update task ─────────────────────────────────────────────────

export async function updateTask(
  taskId: string,
  data: {
    title?: string;
    description?: string;
    dueDate?: string;
    priority?: TaskPriority;
    status?: TaskStatus;
  },
) {
  const pm = await requireAdmin();

  try {
    const updated = await TaskService.updateTask(taskId, {
      ...data,
      dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
    });

    revalidatePath(`/admin-portal/engagements/${updated.engagementId}`);
    revalidatePath("/client-portal/dashboard");

    void logAudit(pm.id, "TASK_UPDATED", "Task", taskId, data);

    return { success: true };
  } catch (error) {
    console.error("Error updating task:", error);
    return { success: false, error: "Failed to update task" };
  }
}

// ── PM/Admin: Delete task ─────────────────────────────────────────────────

export async function deleteTask(taskId: string) {
  const pm = await requireAdmin();

  try {
    // Get engagement ID before deletion
    const task = await prisma.task.findUnique({
      where: { id: taskId },
      select: { engagementId: true },
    });

    await TaskService.deleteTask(taskId);

    if (task) {
      revalidatePath(`/admin-portal/engagements/${task.engagementId}`);
      revalidatePath("/client-portal/dashboard");
    }

    void logAudit(pm.id, "TASK_DELETED", "Task", taskId, {});

    return { success: true };
  } catch (error) {
    console.error("Error deleting task:", error);
    return { success: false, error: "Failed to delete task" };
  }
}

// ── Get pending tasks count ───────────────────────────────────────────────

export async function getPendingTasksCount(engagementId: string) {
  return TaskService.getPendingTasksCount(engagementId);
}
