"use client";

import { useState, useRef, useEffect } from "react";
import { logout } from "@/app/actions/auth";
import Link from "next/link";

interface HeaderProps {
  userName: string;
  userRole: string;
  dateJoined?: string | null;
}

function formatDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function addTenWeeks(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  date.setUTCDate(date.getUTCDate() + 70);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

export function Header({ userName, userRole, dateJoined }: HeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownOpen]);

  return (
    <>
      <div className="bg-accent text-white text-center text-sm font-bold py-2 px-4 flex items-center justify-center gap-4">
        <a
          href="https://www.skool.com/blueocean"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-bold"
        >
          SKOOL MODULES
        </a>
        <span className="text-white/40 font-bold">|</span>
        <a
          href="https://discord.gg/JJ6pwFDU"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline font-bold"
        >
          DISCORD COMMUNITY
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
          {userRole === "STUDENT" ? (
            <div className="relative hidden sm:block" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="text-sm text-muted hover:text-foreground transition-colors"
              >
                {userName}
                <svg
                  className={`inline-block ml-1 h-3 w-3 transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 rounded-lg border border-border bg-card shadow-lg z-50 p-4 space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted">Date Joined</p>
                    <p className="text-sm text-foreground mt-0.5">
                      {dateJoined ? formatDate(dateJoined) : "Unavailable"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs font-medium text-muted">Program End Date</p>
                    <p className="text-sm text-foreground mt-0.5">
                      {dateJoined ? addTenWeeks(dateJoined) : "Unavailable"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <span className="text-sm text-muted hidden sm:inline">{userName}</span>
          )}
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
