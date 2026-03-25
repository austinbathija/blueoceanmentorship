"use client";

import { useState, useTransition } from "react";
import { updateStudentLinks } from "@/app/actions/dashboard";

interface StudentLinksProps {
  mentorshipGuideUrl: string | null;
  storeUrl: string | null;
  miroUrl: string | null;
}

function LinkField({
  label,
  value,
  placeholder,
  onSave,
}: {
  label: string;
  value: string;
  placeholder: string;
  onSave: (value: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function save() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== value) {
      onSave(trimmed);
    }
  }

  if (editing) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted w-36 shrink-0">{label}</span>
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
          placeholder={placeholder}
          className="flex-1 rounded border border-border bg-background px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground/20"
        />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm font-medium text-muted w-36 shrink-0">{label}</span>
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

export function StudentLinks({ mentorshipGuideUrl, storeUrl, miroUrl }: StudentLinksProps) {
  const [guide, setGuide] = useState(mentorshipGuideUrl ?? "");
  const [store, setStore] = useState(storeUrl ?? "");
  const [, startTransition] = useTransition();

  function saveLinks(newGuide: string, newStore: string) {
    startTransition(async () => {
      await updateStudentLinks(newGuide || null, newStore || null);
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4 mb-6 space-y-3">
      <h3 className="text-sm font-semibold text-foreground mb-2">Your Links</h3>

      <LinkField
        label="Mentorship Guide"
        value={guide}
        placeholder="https://docs.google.com/..."
        onSave={(v) => {
          setGuide(v);
          saveLinks(v, store);
        }}
      />

      <LinkField
        label="Store Link"
        value={store}
        placeholder="https://yourstore.com"
        onSave={(v) => {
          setStore(v);
          saveLinks(guide, v);
        }}
      />

      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-muted w-36 shrink-0">Miro Board</span>
        {miroUrl ? (
          <a
            href={miroUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-blue-400 hover:underline truncate"
          >
            {miroUrl}
          </a>
        ) : (
          <span className="text-sm text-muted/60 italic">Your coach will add this shortly</span>
        )}
      </div>
    </div>
  );
}
