"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function updatePhase(phase: number) {
  const user = await getCurrentUser();

  await prisma.user.update({
    where: { id: user.id },
    data: { currentPhase: phase },
  });

  revalidatePath("/dashboard");
}

export async function toggleCompletion(checklistItemId: string, completed: boolean) {
  const user = await getCurrentUser();

  await prisma.studentCompletion.upsert({
    where: {
      userId_checklistItemId: {
        userId: user.id,
        checklistItemId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
      completedById: user.id,
    },
    create: {
      userId: user.id,
      checklistItemId,
      completed,
      completedAt: completed ? new Date() : null,
      completedById: user.id,
    },
  });
}

export async function toggleCompletionForStudent(
  studentId: string,
  checklistItemId: string,
  completed: boolean
) {
  const currentUser = await getCurrentUser();

  if (currentUser.role !== "COACH" && currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.studentCompletion.upsert({
    where: {
      userId_checklistItemId: {
        userId: studentId,
        checklistItemId,
      },
    },
    update: {
      completed,
      completedAt: completed ? new Date() : null,
      completedById: currentUser.id,
    },
    create: {
      userId: studentId,
      checklistItemId,
      completed,
      completedAt: completed ? new Date() : null,
      completedById: currentUser.id,
    },
  });
}

export async function updateStudentLinks(
  mentorshipGuideUrl: string | null,
  storeUrl: string | null
) {
  const user = await getCurrentUser();

  await prisma.user.update({
    where: { id: user.id },
    data: { mentorshipGuideUrl, storeUrl },
  });
}

export async function addCallRecording(studentId: string, title: string, url: string, password: string | null) {
  const user = await getCurrentUser();

  if (user.role !== "COACH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.callRecording.create({
    data: {
      title,
      url,
      password: password || null,
      studentId,
    },
  });

  revalidatePath(`/coach/student/${studentId}`);
  revalidatePath("/dashboard");
}

export async function deleteCallRecording(id: string) {
  const user = await getCurrentUser();

  if (user.role !== "COACH" && user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  const recording = await prisma.callRecording.findUnique({ where: { id } });

  await prisma.callRecording.delete({
    where: { id },
  });

  if (recording) {
    revalidatePath(`/coach/student/${recording.studentId}`);
  }
  revalidatePath("/dashboard");
}

export async function updateMiroForStudent(studentId: string, miroUrl: string | null) {
  const currentUser = await getCurrentUser();

  if (currentUser.role !== "COACH" && currentUser.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  await prisma.user.update({
    where: { id: studentId },
    data: { miroUrl },
  });
}
