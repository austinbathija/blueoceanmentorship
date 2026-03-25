import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { PhaseContent } from "@/components/phase-content";
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

  const items = checklistItems.map((item) => ({
    id: item.id,
    text: item.text,
    completed: completedIds.has(item.id),
    phase: item.phase,
  }));

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

        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">{student.name}</h2>
          <p className="text-sm text-muted">{student.email}</p>
        </div>

        <PhaseContent
          currentPhase={student.currentPhase}
          items={items}
          studentId={student.id}
        />
      </main>
    </div>
  );
}
