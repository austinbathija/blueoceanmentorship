import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getPhaseLabel } from "@/lib/phases";
import { Header } from "@/components/header";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function CoachPage() {
  const user = await getCurrentUser();

  if (user.role !== "COACH" && user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      completions: {
        where: { completed: true },
        select: { id: true },
      },
    },
    orderBy: { name: "asc" },
  });

  const totalItems = await prisma.checklistItem.count();

  return (
    <div className="min-h-screen">
      <Header userName={user.name} userRole={user.role} />

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h2 className="text-xl font-bold text-foreground">Students</h2>

        {students.length === 0 ? (
          <p className="mt-8 text-center text-muted">No students yet.</p>
        ) : (
          <div className="mt-6 space-y-2">
            {students.map((student) => {
              const completedCount = student.completions.length;
              const percentage =
                totalItems > 0
                  ? Math.round((completedCount / totalItems) * 100)
                  : 0;

              return (
                <Link
                  key={student.id}
                  href={`/coach/student/${student.id}`}
                  className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:border-accent/30"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {student.name}
                    </p>
                    <p className="text-xs text-muted mt-0.5">
                      {getPhaseLabel(student.currentPhase)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-foreground">
                        {completedCount}/{totalItems}
                      </p>
                      <p className="text-xs text-muted">{percentage}%</p>
                    </div>
                    <div className="w-24 h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-accent transition-all"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                    <svg
                      className="h-4 w-4 text-muted"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8.25 4.5l7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
