"use client";

import { ChecklistItemRow } from "./checklist-item";

interface ChecklistSectionProps {
  phaseLabel: string;
  items: { id: string; text: string; completed: boolean }[];
  studentId?: string;
}

export function ChecklistSection({ phaseLabel, items, studentId }: ChecklistSectionProps) {
  return (
    <section>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted border-b border-border pb-2">
        {phaseLabel}
      </h3>
      <div className="space-y-1">
        {items.map((item) => (
          <ChecklistItemRow
            key={item.id}
            id={item.id}
            text={item.text}
            completed={item.completed}
            studentId={studentId}
          />
        ))}
      </div>
    </section>
  );
}
