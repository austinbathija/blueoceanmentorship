"use client";

import { useState } from "react";
import { updateDateJoinedForStudent } from "@/app/actions/dashboard";

interface CoachDateJoinedInputProps {
  studentId: string;
  dateJoined: string | null;
}

export function CoachDateJoinedInput({ studentId, dateJoined }: CoachDateJoinedInputProps) {
  const [value, setValue] = useState(dateJoined ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      await updateDateJoinedForStudent(studentId, value || null);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted w-36 shrink-0">Date Joined</span>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground"
      />
      <button
        onClick={handleSave}
        disabled={saving}
        className="rounded bg-accent px-3 py-1 text-xs text-white hover:bg-accent-hover transition-colors disabled:opacity-50"
      >
        {saving ? "Saving..." : saved ? "Saved" : "Save"}
      </button>
    </div>
  );
}
