"use client";

import { useState, useTransition } from "react";
import { generateInviteCodes } from "@/app/actions/admin";

interface InviteCode {
  id: string;
  code: string;
  used: boolean;
  usedBy: string | null;
  createdAt: string;
  usedAt: string | null;
}

export function InviteCodesPanel({ codes }: { codes: InviteCode[] }) {
  const [batchCount, setBatchCount] = useState(1);
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  function handleGenerate() {
    startTransition(async () => {
      const generated = await generateInviteCodes(batchCount);
      setNewCodes(generated);
    });
  }

  return (
    <section>
      <h2 className="text-lg font-bold text-foreground mb-4">Invite Codes</h2>

      <div className="flex items-end gap-3 mb-4">
        <div>
          <label className="block text-xs text-muted mb-1">Count</label>
          <input
            type="number"
            min={1}
            max={20}
            value={batchCount}
            onChange={(e) => setBatchCount(Number(e.target.value))}
            className="w-20 rounded border border-border bg-card px-3 py-2 text-sm text-foreground focus:border-accent focus:outline-none"
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isPending}
          className="rounded bg-accent px-4 py-2 text-sm font-medium text-white hover:bg-accent-hover disabled:opacity-50 transition-colors"
        >
          {isPending ? "Generating..." : "Generate Codes"}
        </button>
      </div>

      {newCodes.length > 0 && (
        <div className="mb-4 rounded-lg border border-accent/30 bg-accent/5 p-4">
          <p className="text-xs text-muted mb-2">New codes generated:</p>
          <div className="flex flex-wrap gap-2">
            {newCodes.map((code) => (
              <code
                key={code}
                className="rounded bg-card px-2 py-1 text-sm font-mono text-accent"
              >
                {code}
              </code>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-card">
            <tr>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Code</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Status</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Used By</th>
              <th className="px-4 py-2.5 text-left text-xs font-medium text-muted">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {codes.map((code) => (
              <tr key={code.id}>
                <td className="px-4 py-2.5 font-mono text-foreground">{code.code}</td>
                <td className="px-4 py-2.5">
                  {code.used ? (
                    <span className="inline-flex items-center rounded-full bg-muted/10 px-2 py-0.5 text-xs text-muted">
                      Used
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-accent/10 px-2 py-0.5 text-xs text-accent">
                      Available
                    </span>
                  )}
                </td>
                <td className="px-4 py-2.5 text-muted">{code.usedBy || "—"}</td>
                <td className="px-4 py-2.5 text-muted">
                  {new Date(code.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
