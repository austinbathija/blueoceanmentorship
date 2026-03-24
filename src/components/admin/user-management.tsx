"use client";

import { useTransition } from "react";
import { updateUserRole, deleteUser } from "@/app/actions/admin";
import { getPhaseLabel } from "@/lib/phases";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  currentPhase: number;
  createdAt: string;
}

export function UserManagement({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleRoleChange(userId: string, newRole: string) {
    startTransition(() => {
      updateUserRole(userId, newRole as "ADMIN" | "COACH" | "STUDENT");
    });
  }

  function handleDelete(userId: string, userName: string) {
    if (!confirm(`Delete ${userName}? This cannot be undone.`)) return;
    startTransition(() => {
      deleteUser(userId);
    });
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">Users</h2>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Name</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Email</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Role</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Phase</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Joined</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2.5 text-foreground">{user.name}</td>
                <td className="px-4 py-2.5 text-muted">{user.email}</td>
                <td className="px-4 py-2.5">
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                    disabled={isPending || user.id === currentUserId}
                    className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground focus:border-accent focus:outline-none disabled:opacity-50"
                  >
                    <option value="STUDENT">Student</option>
                    <option value="COACH">Coach</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                </td>
                <td className="px-4 py-2.5 text-muted text-xs">
                  {getPhaseLabel(user.currentPhase)}
                </td>
                <td className="px-4 py-2.5 text-muted text-xs">
                  {new Date(user.createdAt).toLocaleDateString()}
                </td>
                <td className="px-4 py-2.5">
                  {user.id !== currentUserId && (
                    <button
                      onClick={() => handleDelete(user.id, user.name)}
                      disabled={isPending}
                      className="text-xs text-muted hover:text-danger transition-colors disabled:opacity-50"
                    >
                      Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
