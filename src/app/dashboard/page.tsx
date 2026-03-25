import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { PhaseContent } from "@/components/phase-content";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [checklistItems, completions] = await Promise.all([
    prisma.checklistItem.findMany({
      orderBy: [{ phase: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.studentCompletion.findMany({
      where: { userId: user.id, completed: true },
      select: { checklistItemId: true },
    }),
  ]);

  const completedIds = new Set(completions.map((c) => c.checklistItemId));

  const items = checklistItems.map((item) => ({
    id: item.id,
    text: item.text,
    completed: completedIds.has(item.id),
    phase: item.phase,
  }));

  return (
    <div className="min-h-screen">
      <Header userName={user.name} userRole={user.role} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Welcome back, {user.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted mt-1">
            Track your progress through the Blue Ocean Program.
          </p>
        </div>

        <PhaseContent currentPhase={user.currentPhase} items={items} />
      </main>
    </div>
  );
}
