import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { supabaseId: authUser.id },
  });

  if (!user) {
    redirect("/login");
  }

  // Keep role cookie in sync with database (handles role changes by admin)
  const cookieStore = await cookies();
  const currentRoleCookie = cookieStore.get("user-role")?.value;
  if (currentRoleCookie !== user.role) {
    cookieStore.set("user-role", user.role, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
    });
  }

  return user;
}
