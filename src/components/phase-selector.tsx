"use client";

import { useState, useTransition } from "react";
import { updatePhase } from "@/app/actions/dashboard";
import { PHASES } from "@/lib/phases";

interface PhaseSelectorProps {
  currentPhase: number;
}

export function PhaseSelector({ currentPhase }: PhaseSelectorProps) {
  const [phase, setPhase] = useState(currentPhase);
  const [isPending, startTransition] = useTransition();

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const newPhase = Number(e.target.value);
    setPhase(newPhase);
    startTransition(() => {
      updatePhase(newPhase);
    });
  }

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="phase" className="text-sm font-medium text-muted">
        Current Phase:
      </label>
      <select
        id="phase"
        value={phase}
        onChange={handleChange}
        disabled={isPending}
        className="rounded-lg border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent disabled:opacity-50"
      >
        {PHASES.map((p) => (
          <option key={p.value} value={p.value}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  );
}
