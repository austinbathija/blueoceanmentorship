"use client";

import { PHASES } from "@/lib/phases";

interface PhaseNavProps {
  currentPhase: number;
  selectedPhase: number;
  onSelectPhase: (phase: number) => void;
  completionByPhase: Record<number, { completed: number; total: number }>;
}

const phaseIcons: Record<string, React.ReactNode> = {
  rocket: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 01-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 006.16-12.12A14.98 14.98 0 009.631 8.41m5.96 5.96a14.926 14.926 0 01-5.841 2.58m-.119-8.54a6 6 0 00-7.381 5.84h4.8m2.581-5.84a14.927 14.927 0 00-2.58 5.84m2.699 2.7c-.103.021-.207.041-.311.06a15.09 15.09 0 01-2.448-2.448 14.9 14.9 0 01.06-.312m-2.24 2.39a4.493 4.493 0 00-1.757 4.306 4.493 4.493 0 004.306-1.758M16.5 9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
    </svg>
  ),
  wrench: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.42 15.17l-5.384 5.383a1.5 1.5 0 01-2.12-2.121L9.3 13.05a1.5 1.5 0 012.12 2.12zm0 0L15.75 9m-3.33 6.17A5.25 5.25 0 1019.5 4.5l-3 3-1.5-1.5-3 3 1.5 1.5z" />
    </svg>
  ),
  search: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
  store: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.75c0 .415.336.75.75.75z" />
    </svg>
  ),
  shield: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  ),
  chart: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" />
    </svg>
  ),
  flag: (
    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" />
    </svg>
  ),
};

export function PhaseNav({
  currentPhase,
  selectedPhase,
  onSelectPhase,
  completionByPhase,
}: PhaseNavProps) {
  return (
    <nav className="flex gap-1 overflow-x-auto pb-2 scrollbar-hide">
      {PHASES.map((phase) => {
        const stats = completionByPhase[phase.value] || { completed: 0, total: 0 };
        const isSelected = selectedPhase === phase.value;
        const isCurrent = currentPhase === phase.value;
        const isComplete = stats.total > 0 && stats.completed === stats.total;
        const percentage = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0;

        return (
          <button
            key={phase.value}
            onClick={() => onSelectPhase(phase.value)}
            className={`relative flex flex-col items-center gap-1.5 rounded-lg px-3 py-2.5 text-xs font-medium transition-all whitespace-nowrap min-w-[80px] ${
              isSelected
                ? "bg-accent/15 text-accent border border-accent/30"
                : "text-muted hover:text-foreground hover:bg-card border border-transparent"
            }`}
          >
            <div className="flex items-center gap-1.5">
              {isComplete ? (
                <svg className="h-4 w-4 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                phaseIcons[phase.icon]
              )}
              <span>{phase.value}</span>
            </div>
            <span className="text-[10px] opacity-70">{phase.shortLabel}</span>
            {/* Progress indicator */}
            {stats.total > 0 && (
              <div className="w-full h-1 rounded-full bg-border overflow-hidden mt-0.5">
                <div
                  className="h-full rounded-full transition-all duration-200 bg-emerald-400"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            )}
            {/* Current phase indicator */}
            {isCurrent && !isSelected && (
              <div className="absolute -top-1 -right-1 h-2 w-2 rounded-full bg-accent" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
