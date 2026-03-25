"use client";

import { useState, useCallback, useTransition } from "react";
import { PHASES } from "@/lib/phases";
import { PhaseNav } from "./phase-nav";
import { ChecklistItemRow } from "./checklist-item";
import { updatePhase } from "@/app/actions/dashboard";

interface PhaseItem {
  id: string;
  text: string;
  completed: boolean;
  phase: number;
}

interface PhaseContentProps {
  currentPhase: number;
  items: PhaseItem[];
  studentId?: string;
  readOnly?: boolean;
}

export function PhaseContent({ currentPhase, items: initialItems, studentId, readOnly }: PhaseContentProps) {
  const [selectedPhase, setSelectedPhase] = useState(currentPhase);
  const [isPending, startTransition] = useTransition();
  const [completedIds, setCompletedIds] = useState<Set<string>>(
    () => new Set(initialItems.filter((i) => i.completed).map((i) => i.id))
  );

  const handleItemToggle = useCallback((itemId: string, newValue: boolean) => {
    setCompletedIds((prev) => {
      const next = new Set(prev);
      if (newValue) {
        next.add(itemId);
      } else {
        next.delete(itemId);
      }
      return next;
    });
  }, []);

  // Derive items with current completion state
  const items = initialItems.map((item) => ({
    ...item,
    completed: completedIds.has(item.id),
  }));

  // Group items by phase
  const itemsByPhase: Record<number, PhaseItem[]> = {};
  for (const item of items) {
    if (!itemsByPhase[item.phase]) itemsByPhase[item.phase] = [];
    itemsByPhase[item.phase].push(item);
  }

  // Compute completion stats per phase
  const completionByPhase: Record<number, { completed: number; total: number }> = {};
  for (const phase of PHASES) {
    const phaseItems = itemsByPhase[phase.value] || [];
    completionByPhase[phase.value] = {
      completed: phaseItems.filter((i) => i.completed).length,
      total: phaseItems.length,
    };
  }

  // Overall stats
  const totalCompleted = items.filter((i) => i.completed).length;
  const totalItems = items.length;
  const overallPercentage = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  // Current phase data
  const phase = PHASES.find((p) => p.value === selectedPhase);
  const phaseItems = itemsByPhase[selectedPhase] || [];
  const phaseStats = completionByPhase[selectedPhase] || { completed: 0, total: 0 };
  const phasePercentage = phaseStats.total > 0 ? Math.round((phaseStats.completed / phaseStats.total) * 100) : 0;
  const phaseComplete = phaseStats.total > 0 && phaseStats.completed === phaseStats.total;

  function handleAdvancePhase() {
    if (selectedPhase >= 6) return;
    const nextPhase = selectedPhase + 1;
    setSelectedPhase(nextPhase);
    startTransition(() => {
      updatePhase(nextPhase);
    });
  }

  return (
    <div className="space-y-6">
      {/* Overall progress bar */}
      <div className="rounded-lg border border-border bg-card p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-foreground">Overall Progress</span>
          <span className="text-sm text-muted">
            {totalCompleted}/{totalItems} tasks ({overallPercentage}%)
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-border overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-200 bg-emerald-400"
            style={{ width: `${overallPercentage}%` }}
          />
        </div>
      </div>

      {/* Phase navigation tabs */}
      <PhaseNav
        currentPhase={currentPhase}
        selectedPhase={selectedPhase}
        onSelectPhase={setSelectedPhase}
        completionByPhase={completionByPhase}
      />

      {/* Phase content area */}
      {phase && (
        <div className="rounded-lg border border-border bg-card overflow-hidden">
          {/* Phase header */}
          <div className="border-b border-border px-5 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-foreground">{phase.label}</h3>
              {phaseComplete && (
                <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-full">
                  <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  Complete
                </span>
              )}
            </div>
            <p className="text-sm text-muted mt-1.5 leading-relaxed">{phase.description}</p>

            {/* Phase progress */}
            {phaseStats.total > 0 && (
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-muted">
                    {phaseStats.completed} of {phaseStats.total} tasks complete
                  </span>
                  <span className="text-xs font-medium text-foreground">{phasePercentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-border overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-200 bg-emerald-400"
                    style={{ width: `${phasePercentage}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Checklist items */}
          <div className="divide-y divide-border/50">
            {phaseItems.length === 0 ? (
              <div className="px-5 py-12 text-center">
                <p className="text-sm text-muted">No tasks for this phase yet.</p>
                <p className="text-xs text-muted mt-1">
                  An admin can add checklist items from the Admin panel.
                </p>
              </div>
            ) : (
              phaseItems.map((item) => (
                <ChecklistItemRow
                  key={item.id}
                  id={item.id}
                  text={item.text}
                  completed={item.completed}
                  studentId={studentId}
                  readOnly={readOnly}
                  onToggle={handleItemToggle}
                />
              ))
            )}
          </div>

          {/* Phase advance button */}
          {!studentId && phaseComplete && selectedPhase < 6 && selectedPhase === currentPhase && (
            <div className="border-t border-border px-5 py-4">
              <button
                onClick={handleAdvancePhase}
                disabled={isPending}
                className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-accent-hover disabled:opacity-50"
              >
                {isPending ? "Advancing..." : `Continue to Phase ${selectedPhase + 1}`}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
