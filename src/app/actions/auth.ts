"use server";

import { createClient } from "@/lib/supabase/server";
import { getSupabaseAdmin } from "@/lib/supabase/admin";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function login(formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Set role cookie for middleware
  const user = await prisma.user.findUnique({
    where: { supabaseId: data.user.id },
  });

  if (user) {
    const cookieStore = await cookies();
    cookieStore.set("user-role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  redirect("/dashboard");
}

export async function signup(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const inviteCode = formData.get("inviteCode") as string;

  if (!name || !email || !password || !inviteCode) {
    return { error: "All fields are required" };
  }

  // Validate invite code
  const code = await prisma.inviteCode.findUnique({
    where: { code: inviteCode },
  });

  if (!code) {
    return { error: "Invalid invite code" };
  }

  if (code.used) {
    return { error: "This invite code has already been used" };
  }

  // Create Supabase Auth user
  const supabase = await createClient();
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return { error: authError.message };
  }

  if (!authData.user) {
    return { error: "Failed to create account" };
  }

  try {
    // Create User record in database
    await prisma.user.create({
      data: {
        email,
        name,
        supabaseId: authData.user.id,
        role: "STUDENT",
        currentPhase: 0,
      },
    });

    // Mark invite code as used
    await prisma.inviteCode.update({
      where: { code: inviteCode },
      data: {
        used: true,
        usedBy: email,
        usedAt: new Date(),
      },
    });

    // Set role cookie
    const cookieStore = await cookies();
    cookieStore.set("user-role", "STUDENT", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  } catch (dbError) {
    // Clean up Supabase auth user if DB operations fail
    await getSupabaseAdmin().auth.admin.deleteUser(authData.user.id);
    return { error: "Failed to create account. Please try again." };
  }

  redirect("/dashboard");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();

  const cookieStore = await cookies();
  cookieStore.delete("user-role");

  redirect("/login");
}
