import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { ChecklistEditor } from "@/components/admin/checklist-editor";
import { InviteCodesPanel } from "@/components/admin/invite-codes";
import { UserManagement } from "@/components/admin/user-management";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const user = await getCurrentUser();

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const [checklistItems, inviteCodes, users] = await Promise.all([
    prisma.checklistItem.findMany({
      orderBy: [{ phase: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.inviteCode.findMany({
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    }),
  ]);

  return (
    <div className="min-h-screen">
      <Header userName={user.name} userRole={user.role} />

      <main className="mx-auto max-w-4xl px-4 py-8 space-y-12">
        <ChecklistEditor
          items={checklistItems.map((item) => ({
            id: item.id,
            text: item.text,
            phase: item.phase,
            sortOrder: item.sortOrder,
          }))}
        />

        <InviteCodesPanel
          codes={inviteCodes.map((code) => ({
            id: code.id,
            code: code.code,
            used: code.used,
            usedBy: code.usedBy,
            createdAt: code.createdAt.toISOString(),
            usedAt: code.usedAt?.toISOString() || null,
          }))}
        />

        <UserManagement
          users={users.map((u) => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            currentPhase: u.currentPhase,
            createdAt: u.createdAt.toISOString(),
          }))}
          currentUserId={user.id}
        />
      </main>
    </div>
  );
}
