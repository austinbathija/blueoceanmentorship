"use server";

import { prisma } from "@/lib/prisma";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { getCurrentUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Role } from "@prisma/client";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }
  return user;
}

// --- Checklist Items ---

export async function createChecklistItem(formData: FormData) {
  await requireAdmin();

  const text = formData.get("text") as string;
  const phase = Number(formData.get("phase"));
  const sortOrder = Number(formData.get("sortOrder") || "0");

  if (!text || isNaN(phase)) {
    return { error: "Text and phase are required" };
  }

  await prisma.checklistItem.create({
    data: { text, phase, sortOrder },
  });

  revalidatePath("/admin");
}

export async function updateChecklistItem(formData: FormData) {
  await requireAdmin();

  const id = formData.get("id") as string;
  const text = formData.get("text") as string;
  const phase = Number(formData.get("phase"));
  const sortOrder = Number(formData.get("sortOrder") || "0");

  if (!id || !text || isNaN(phase)) {
    return { error: "Invalid data" };
  }

  await prisma.checklistItem.update({
    where: { id },
    data: { text, phase, sortOrder },
  });

  revalidatePath("/admin");
}

export async function deleteChecklistItem(id: string) {
  await requireAdmin();

  await prisma.checklistItem.delete({
    where: { id },
  });

  revalidatePath("/admin");
}

// --- Invite Codes ---

function generateCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export async function generateInviteCodes(count: number = 1) {
  await requireAdmin();

  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    const code = generateCode();
    await prisma.inviteCode.create({
      data: { code },
    });
    codes.push(code);
  }

  revalidatePath("/admin");
  return codes;
}

// --- User Management ---

export async function updateUserRole(userId: string, role: Role) {
  await requireAdmin();

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

  revalidatePath("/admin");
}

export async function deleteUser(userId: string) {
  const admin = await requireAdmin();

  if (admin.id === userId) {
    return { error: "Cannot delete your own account" };
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    return { error: "User not found" };
  }

  // Delete from database first
  await prisma.user.delete({
    where: { id: userId },
  });

  // Delete from Supabase Auth
  await getSupabaseAdmin().auth.admin.deleteUser(user.supabaseId);

  revalidatePath("/admin");
}
