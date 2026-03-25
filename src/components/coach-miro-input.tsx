"use client";

import { useState, useTransition } from "react";
import { updateMiroForStudent } from "@/app/actions/dashboard";

interface CoachMiroInputProps {
  studentId: string;
  miroUrl: string | null;
}

export function CoachMiroInput({ studentId, miroUrl }: CoachMiroInputProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(miroUrl ?? "");
  const [draft, setDraft] = useState(miroUrl ?? "");
  const [, startTransition] = useTransition();

  function save() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) {
      setValue(trimmed);
      startTransition(async () => {
        await updateMiroForStudent(studentId, trimmed || null);
      });
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted w-24 shrink-0">Miro Board</span>
        <input
          autoFocus
          type="url"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={save}
          onKeyDown={(e) => {
            if (e.key === "Enter") save();
            if (e.key === "Escape") {
              setDraft(value);
              setEditing(false);
            }
          }}
          placeholder="https://miro.com/app/board/..."
          className="flex-1 rounded border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted w-24 shrink-0">Miro Board</span>
      {value ? (
        <a
          href={value}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-400 hover:underline truncate"
        >
          {value}
        </a>
      ) : (
        <span className="text-sm text-muted/60 italic">Not set</span>
      )}
      <button
        onClick={() => {
          setDraft(value);
          setEditing(true);
        }}
        className="ml-auto shrink-0 text-xs text-muted hover:text-foreground transition-colors"
      >
        {value ? "Edit" : "Add"}
      </button>
    </div>
  );
}
