import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Header } from "@/components/header";
import { PhaseContent } from "@/components/phase-content";
import { StudentLinks } from "@/components/student-links";
import { CallRecordingForm } from "@/components/call-recording-form";
import { DisableCopy } from "@/components/disable-copy";
import { Footer } from "@/components/footer";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  const [checklistItems, completions, callRecordings] = await Promise.all([
    prisma.checklistItem.findMany({
      orderBy: [{ phase: "asc" }, { sortOrder: "asc" }],
    }),
    prisma.studentCompletion.findMany({
      where: { userId: user.id, completed: true },
      select: { checklistItemId: true },
    }),
    prisma.callRecording.findMany({
      where: { studentId: user.id },
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

  const canEditRecordings = user.role === "COACH" || user.role === "ADMIN";

  return (
    <div className="min-h-screen flex flex-col">
      {user.role === "STUDENT" && <DisableCopy />}
      <Header
        userName={user.name}
        userRole={user.role}
        dateJoined={user.dateJoined ? user.dateJoined.toISOString().split("T")[0] : null}
      />

      <main className="mx-auto max-w-3xl px-4 py-8 flex-1">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">
            Welcome back, {user.name.split(" ")[0]}
          </h2>
          <p className="text-sm text-muted mt-1">
            Track your progress through the Blue Ocean Program.
          </p>
        </div>

        {serializedRecordings.length > 0 && (
          <div className="mb-6">
            <CallRecordingForm studentId={user.id} recordings={serializedRecordings} canEdit={canEditRecordings} />
          </div>
        )}

        <StudentLinks
          mentorshipGuideUrl={user.mentorshipGuideUrl}
          storeUrl={user.storeUrl}
          miroUrl={user.miroUrl}
        />

        <PhaseContent currentPhase={user.currentPhase} items={items} />
      </main>

      <Footer />
    </div>
  );
}
