"use client";

import { useState, useTransition } from "react";
import { toggleCompletion, toggleCompletionForStudent } from "@/app/actions/dashboard";

interface ChecklistItemRowProps {
  id: string;
  text: string;
  completed: boolean;
  studentId?: string;
}

export function ChecklistItemRow({
  id,
  text,
  completed: initialCompleted,
  studentId,
}: ChecklistItemRowProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  function handleToggle() {
    const newValue = !completed;
    setCompleted(newValue); // Optimistic update

    startTransition(async () => {
      try {
        if (studentId) {
          await toggleCompletionForStudent(studentId, id, newValue);
        } else {
          await toggleCompletion(id, newValue);
        }
      } catch {
        setCompleted(!newValue); // Revert on error
      }
    });
  }

  return (
    <label
      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-card ${
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
