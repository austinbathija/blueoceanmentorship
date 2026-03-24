export const PHASES = [
  { value: 0, label: "Phase 0: Introduction & Mindset" },
  { value: 1, label: "Phase 1: Essentials" },
  { value: 2, label: "Phase 2: Research & Foundation" },
  { value: 3, label: "Phase 3: Build Your Store" },
  { value: 4, label: "Phase 4: GMC Approval" },
  { value: 5, label: "Phase 5: Launch & Scale" },
  { value: 6, label: "Phase 6: Exit" },
] as const;

export function getPhaseLabel(phase: number): string {
  return PHASES.find((p) => p.value === phase)?.label ?? `Phase ${phase}`;
}
