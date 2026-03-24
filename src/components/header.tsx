"use client";

import { logout } from "@/app/actions/auth";
import Link from "next/link";

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  return (
    <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="text-lg font-bold text-foreground tracking-wide">
            BLUE OCEAN PROGRAM
          </Link>
          {(userRole === "COACH" || userRole === "ADMIN") && (
            <nav className="flex items-center gap-4">
              <Link
                href="/coach"
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                Students
              </Link>
              {userRole === "ADMIN" && (
                <Link
                  href="/admin"
                  className="text-sm text-muted hover:text-foreground transition-colors"
                >
                  Admin
                </Link>
              )}
            </nav>
          )}
        </div>
        <form action={logout}>
          <button
            type="submit"
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Logout
          </button>
        </form>
      </div>
    </header>
  );
}
