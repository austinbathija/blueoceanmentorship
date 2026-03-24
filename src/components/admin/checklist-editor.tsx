"use client";

import { useState, useTransition } from "react";
import {
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from "@/app/actions/admin";
import { PHASES, getPhaseLabel } from "@/lib/phases";

interface Item {
  id: string;
  text: string;
  phase: number;
  sortOrder: number;
}

export function ChecklistEditor({ items }: { items: Item[] }) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  // Group by phase
  const itemsByPhase = new Map<number, Item[]>();
  for (const item of items) {
    const existing = itemsByPhase.get(item.phase) || [];
    existing.push(item);
    itemsByPhase.set(item.phase, existing);
  }

  function handleDelete(id: string) {
    if (!confirm("Delete this item? This will remove all student completions for it.")) {
      return;
    }
    startTransition(() => {
      deleteChecklistItem(id);
    });
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">Master Checklist</h2>

      {/* Add new item form */}
      <form
        action={(formData) => {
          startTransition(() => {
            createChecklistItem(formData);
          });
        }}
        className="mb-6 flex flex-wrap gap-2 items-end rounded-lg border border-border bg-card p-4"
      >
        <div className="flex-1 min-w-[200px]">
          <label className="block text-xs text-muted mb-1">Item Text</label>
          <input
            name="text"
            required
            placeholder="New checklist item..."
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground placeholder-muted/50 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="w-48">
          <label className="block text-xs text-muted mb-1">Phase</label>
          <select
            name="phase"
            defaultValue="0"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          >
            {PHASES.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        <div className="w-20">
          <label className="block text-xs text-muted mb-1">Order</label>
          <input
            name="sortOrder"
            type="number"
            defaultValue="0"
            className="w-full rounded border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={isPending}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          Add
        </button>
      </form>

      {/* Items list */}
      <div className="space-y-6">
        {PHASES.map((phase) => {
          const phaseItems = itemsByPhase.get(phase.value) || [];
          if (phaseItems.length === 0) return null;

          return (
            <div key={phase.value}>
              <h3 className="text-xs font-semibold uppercase tracking-widest text-muted border-b border-border pb-2 mb-2">
                {getPhaseLabel(phase.value)}
              </h3>
              <div className="space-y-1">
                {phaseItems.map((item) => (
                  <div key={item.id}>
                    {editingId === item.id ? (
                      <form
                        action={(formData) => {
                          startTransition(() => {
                            updateChecklistItem(formData);
                            setEditingId(null);
                          });
                        }}
                        className="flex gap-2 items-center rounded-lg bg-card px-3 py-2"
                      >
                        <input type="hidden" name="id" value={item.id} />
                        <input
                          name="text"
                          defaultValue={item.text}
                          required
                          className="flex-1 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
                        />
                        <select
                          name="phase"
                          defaultValue={item.phase}
                          className="rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
                        >
                          {PHASES.map((p) => (
                            <option key={p.value} value={p.value}>
                              P{p.value}
                            </option>
                          ))}
                        </select>
                        <input
                          name="sortOrder"
                          type="number"
                          defaultValue={item.sortOrder}
                          className="w-16 rounded border border-border bg-background px-2 py-1 text-sm text-foreground focus:border-accent focus:outline-none"
                        />
                        <button
                          type="submit"
                          className="text-xs text-accent hover:text-accent-hover"
                        >
                          Save
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingId(null)}
                          className="text-xs text-muted hover:text-foreground"
                        >
                          Cancel
                        </button>
                      </form>
                    ) : (
                      <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-card group">
                        <span className="text-sm text-foreground">{item.text}</span>
                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => setEditingId(item.id)}
                            className="text-xs text-muted hover:text-accent"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            className="text-xs text-muted hover:text-danger"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
