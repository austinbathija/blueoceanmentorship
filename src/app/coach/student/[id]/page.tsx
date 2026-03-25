import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { PhaseContent } from "@/components/phase-content";
import { CallRecordingForm } from "@/components/call-recording-form";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import { CoachMiroInput } from "@/components/coach-miro-input";
import { Footer } from "@/components/footer";

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

  const [checklistItems, completions, callRecordings] = await Promise.all([
    prisma.checklistItem.findMany({
      orderBy: [{ phase: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.studentCompletion.findMany({
      where: { userId: student.id, completed: true },
      select: { checklistItemId: true },
    }),
    prisma.callRecording.findMany({
      where: { studentId: student.id },
      orderBy: { createdAt: "desc" },
      select: { id: true, title: true, url: true, password: true, createdAt: true },
    }),
  ]);

  const completedIds = new Set(completions.map((c) => c.checklistItemId));

  const items = checklistItems.map((item) => ({
    id: item.id,
    text: item.text,
    completed: completedIds.has(item.id),
    phase: item.phase,
  }));

  const serializedRecordings = callRecordings.map((r) => ({
    ...r,
    createdAt: r.createdAt.toISOString(),
  }));

  return (
    <div className="min-h-screen flex flex-col">
      <Header userName={currentUser.name} userRole={currentUser.role} />

      <main className="mx-auto max-w-3xl px-4 py-8 flex-1">
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
          <p className="text-sm text-muted mb-3">{student.email}</p>

          <div className="rounded-lg border border-border bg-card p-4 space-y-2">
            {student.mentorshipGuideUrl && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted w-36 shrink-0">Mentorship Guide</span>
                <a href={student.mentorshipGuideUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">
                  {student.mentorshipGuideUrl}
                </a>
              </div>
            )}
            {student.storeUrl && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted w-36 shrink-0">Store Link</span>
                <a href={student.storeUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-blue-400 hover:underline truncate">
                  {student.storeUrl}
                </a>
              </div>
            )}
            <CoachMiroInput studentId={student.id} miroUrl={student.miroUrl} />
          </div>
        </div>

        <div className="mb-6">
          <CallRecordingForm studentId={student.id} recordings={serializedRecordings} canEdit={true} />
        </div>

        <PhaseContent
          currentPhase={student.currentPhase}
          items={items}
          readOnly
        />
      </main>

      <Footer />
    </div>
  );
}
