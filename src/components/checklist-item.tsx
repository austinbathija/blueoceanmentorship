"use client";

import { useTransition } from "react";
import { toggleCompletion, toggleCompletionForStudent } from "@/app/actions/dashboard";

interface ChecklistItemRowProps {
  id: string;
  text: string;
  completed: boolean;
  studentId?: string;
  readOnly?: boolean;
  onToggle?: (itemId: string, newValue: boolean) => void;
}

export function ChecklistItemRow({
  id,
  text,
  completed,
  studentId,
  readOnly,
  onToggle,
}: ChecklistItemRowProps) {
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    if (readOnly) return;
    const newValue = !completed;
    onToggle?.(id, newValue);

    startTransition(async () => {
      try {
        if (studentId) {
          await toggleCompletionForStudent(studentId, id, newValue);
        } else {
          await toggleCompletion(id, newValue);
        }
      } catch {
        onToggle?.(id, !newValue);
      }
    });
  }

  if (readOnly) {
    return (
      <div className="flex items-center gap-3 px-5 py-3">
        <input
          type="checkbox"
          checked={completed}
          disabled
          className="mt-0.5 opacity-60 cursor-default"
        />
        <span
          className={`text-sm ${
            completed ? "text-muted line-through" : "text-foreground"
          }`}
        >
          {text}
        </span>
      </div>
    );
  }

  return (
    <label
      className={`flex cursor-pointer items-center gap-3 px-5 py-3 transition-colors hover:bg-background/50 ${
        isPending ? "opacity-70" : ""
      }`}
    >
      <input
        type="checkbox"
        checked={completed}
        onChange={handleToggle}
        className="mt-0.5"
      />
      <span
        className={`text-sm transition-colors ${
          completed ? "text-muted line-through" : "text-foreground"
        }`}
      >
        {text}
      </span>
    </label>
  );
}
