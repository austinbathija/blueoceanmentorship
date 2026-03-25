"use client";

import { useState, useTransition } from "react";
import { addCallRecording, deleteCallRecording } from "@/app/actions/dashboard";

interface Recording {
  id: string;
  title: string;
  url: string;
  password: string | null;
  createdAt: string;
}

interface CallRecordingFormProps {
  studentId: string;
  recordings: Recording[];
  canEdit: boolean;
}

export function CallRecordingForm({ studentId, recordings, canEdit }: CallRecordingFormProps) {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, startTransition] = useTransition();
  const [visiblePasswords, setVisiblePasswords] = useState<Set<string>>(new Set());

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;

    startTransition(async () => {
      await addCallRecording(studentId, title.trim(), url.trim(), password.trim() || null);
      setTitle("");
      setUrl("");
      setPassword("");
      setShowForm(false);
    });
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCallRecording(id);
    });
  }

  function togglePasswordVisibility(id: string) {
    setVisiblePasswords((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">1:1 Call Recordings</h3>
        {canEdit && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="text-xs text-accent hover:text-accent/80 transition-colors font-medium"
          >
            + Add Recording
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-4 space-y-2 rounded border border-border bg-background p-3">
          <input
            type="text"
            placeholder="Title (e.g. Week 3 - 1:1 Call)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground/20"
          />
          <input
            type="url"
            placeholder="Link to call recording"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground/20"
          />
          <input
            type="text"
            placeholder="Password (optional)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded border border-border bg-card px-3 py-1.5 text-sm text-foreground outline-none focus:ring-1 focus:ring-foreground/20"
          />
          <div className="flex items-center gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="rounded bg-accent px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-accent/90 disabled:opacity-50"
            >
              {isPending ? "Saving..." : "Add"}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setTitle("");
                setUrl("");
                setPassword("");
              }}
              className="text-xs text-muted hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {recordings.length === 0 ? (
        <p className="text-sm text-muted/60 italic">No recordings yet.</p>
      ) : (
        <div className="space-y-2">
          {recordings.map((rec) => (
            <div
              key={rec.id}
              className="flex items-start justify-between gap-3 rounded border border-border bg-background px-3 py-2.5"
            >
              <div className="min-w-0 flex-1">
                <a
                  href={rec.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-blue-400 hover:underline"
                >
                  {rec.title}
                </a>
                {rec.password && (
                  <div className="mt-1 flex items-center gap-1.5">
                    <span className="text-xs text-muted">Password:</span>
                    <span className="text-xs text-foreground font-mono">
                      {visiblePasswords.has(rec.id) ? rec.password : "••••••"}
                    </span>
                    <button
                      onClick={() => togglePasswordVisibility(rec.id)}
                      className="text-xs text-muted hover:text-foreground transition-colors"
                    >
                      {visiblePasswords.has(rec.id) ? "Hide" : "Show"}
                    </button>
                  </div>
                )}
                <p className="text-xs text-muted mt-0.5">
                  {new Date(rec.createdAt).toLocaleDateString()}
                </p>
              </div>
              {canEdit && (
                <button
                  onClick={() => handleDelete(rec.id)}
                  disabled={isPending}
                  className="shrink-0 text-xs text-red-400/70 hover:text-red-400 transition-colors mt-0.5"
                >
                  Remove
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
