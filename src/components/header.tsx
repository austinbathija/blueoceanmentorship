"use client";

import { logout } from "@/app/actions/auth";
import Link from "next/link";

interface HeaderProps {
  userName: string;
  userRole: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  return (
    <>
      <div className="bg-accent text-white text-center text-sm py-2 px-4 flex items-center justify-center gap-4">
        <a
          href="https://www.skool.com/blueocean"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          SKOOL COMMUNITY
        </a>
        <span className="text-white/40">|</span>
        <a
          href="https://discord.gg/JJ6pwFDU"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-medium"
        >
          DISCORD
        </a>
      </div>
      <header className="border-b border-border bg-card">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <div className="flex items-center gap-6">
          <Link href={userRole === "STUDENT" ? "/dashboard" : "/coach"} className="text-lg font-bold text-foreground tracking-wide">
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
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted hidden sm:inline">{userName}</span>
          <form action={logout}>
            <button
              type="submit"
              className="text-sm text-muted hover:text-foreground transition-colors"
            >
              Logout
            </button>
          </form>
        </div>
      </div>
    </header>
    </>
  );
}
