import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHASES, getPhaseLabel } from "@/lib/phases";
import { Header } from "@/components/header";
import { PhaseSelector } from "@/components/phase-selector";
import { ChecklistSection } from "@/components/checklist-section";

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
  const totalItems = checklistItems.length;
  const completedCount = completedIds.size;

  // Group items by phase
  const itemsByPhase = new Map<number, typeof checklistItems>();
  for (const item of checklistItems) {
    const existing = itemsByPhase.get(item.phase) || [];
    existing.push(item);
    itemsByPhase.set(item.phase, existing);
  }

  return (
    <div className="min-h-screen">
      <Header userName={user.name} userRole={user.role} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-xl font-bold text-foreground">
          Welcome, {user.name.split(" ")[0]}
        </h2>

        <div className="mt-4">
          <PhaseSelector currentPhase={user.currentPhase} />
        </div>

        <div className="mt-8 space-y-8">
          {PHASES.map((phase) => {
            const items = itemsByPhase.get(phase.value) || [];
            if (items.length === 0) return null;

            return (
              <ChecklistSection
                key={phase.value}
                phaseLabel={getPhaseLabel(phase.value)}
                items={items.map((item) => ({
                  id: item.id,
                  text: item.text,
                  completed: completedIds.has(item.id),
                }))}
              />
            );
          })}
        </div>

        <div className="mt-8 border-t border-border pt-4">
          <p className="text-sm text-muted">
            Progress: {completedCount}/{totalItems} items complete (
            {totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0}
            %)
          </p>
        </div>
      </main>
    </div>
  );
}
