import { getCurrentUser } from "@/lib/auth";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { DisableCopy } from "@/components/disable-copy";
import Link from "next/link";

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function addWeeks(date: Date, weeks: number): Date {
  const result = new Date(date.getTime());
  result.setUTCDate(result.getUTCDate() + weeks * 7);
  return result;
}

export default async function ProfilePage() {
  const user = await getCurrentUser();

  const dateJoined = user.dateJoined;
  const endDate = dateJoined ? addWeeks(dateJoined, 10) : null;

  return (
    <div className="min-h-screen flex flex-col">
      {user.role === "STUDENT" && <DisableCopy />}
      <Header userName={user.name} userRole={user.role} />

      <main className="mx-auto max-w-3xl px-4 py-8 flex-1">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Back to Dashboard
        </Link>

        <div className="mb-6">
          <h2 className="text-xl font-bold text-foreground">{user.name}</h2>
          <p className="text-sm text-muted mt-1">{user.email}</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 space-y-4">
          <div>
            <p className="text-sm font-medium text-muted">Date Joined</p>
            <p className="text-foreground mt-1">
              {dateJoined ? formatDate(dateJoined) : "Unavailable"}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-muted">Program End Date (10 Weeks)</p>
            <p className="text-foreground mt-1">
              {endDate ? formatDate(endDate) : "Unavailable"}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
