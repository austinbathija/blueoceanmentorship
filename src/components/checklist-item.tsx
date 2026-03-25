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
    setCompleted(newValue);

    startTransition(async () => {
      try {
        if (studentId) {
          await toggleCompletionForStudent(studentId, id, newValue);
        } else {
          await toggleCompletion(id, newValue);
        }
      } catch {
        setCompleted(!newValue);
      }
    });
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
