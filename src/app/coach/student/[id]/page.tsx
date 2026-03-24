import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PHASES, getPhaseLabel } from "@/lib/phases";
import { Header } from "@/components/header";
import { ChecklistSection } from "@/components/checklist-section";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function StudentDetailPage({ params }: Props) {
  const { id } = await params;
  const currentUser = await getCurrentUser();

  if (currentUser.role !== "COACH" && currentUser.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const student = await prisma.user.findUnique({
    where: { id },
  });

  if (!student) {
    notFound();
  }

  const [checklistItems, completions] = await Promise.all([
    prisma.checklistItem.findMany({
      orderBy: [{ phase: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.studentCompletion.findMany({
      where: { userId: student.id, completed: true },
      select: { checklistItemId: true },
    }),
  ]);

  const completedIds = new Set(completions.map((c) => c.checklistItemId));
  const totalItems = checklistItems.length;
  const completedCount = completedIds.size;

  const itemsByPhase = new Map<number, typeof checklistItems>();
  for (const item of checklistItems) {
    const existing = itemsByPhase.get(item.phase) || [];
    existing.push(item);
    itemsByPhase.set(item.phase, existing);
  }

  return (
    <div className="min-h-screen">
      <Header userName={currentUser.name} userRole={currentUser.role} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <Link
          href="/coach"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-4"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Students
        </Link>

        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
            <p className="text-sm text-muted">{student.email}</p>
          </div>
          <p className="text-sm text-muted">
            {getPhaseLabel(student.currentPhase)}
          </p>
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
                studentId={student.id}
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
