export const PHASES = [
  {
    value: 0,
    label: "Phase 0: Introduction & Mindset",
    shortLabel: "Introduction",
    description:
      "Get oriented with the Blue Ocean Program. Watch the intro videos, complete your Entropy Audit, and prepare your workspace for the journey ahead.",
    icon: "rocket",
  },
  {
    value: 1,
    label: "Phase 1: Essentials",
    shortLabel: "Essentials",
    description:
      "Set up the essential accounts and tools you'll need. Create your Google accounts, Shopify store, purchase your domain, and get your branded email running.",
    icon: "wrench",
  },
  {
    value: 2,
    label: "Phase 2: Research & Foundation",
    shortLabel: "Research",
    description:
      "Deep dive into niche research and product sourcing. Run GAP analyses, identify your primary niche, and build your initial product catalog.",
    icon: "search",
  },
  {
    value: 3,
    label: "Phase 3: Build Your Store",
    shortLabel: "Build",
    description:
      "Bring your store to life. Import products, optimize descriptions, create policy pages, set up social media, and get your store reviewed by your coach.",
    icon: "store",
  },
  {
    value: 4,
    label: "Phase 4: GMC Approval",
    shortLabel: "GMC Approval",
    description:
      "Submit your store to Google Merchant Center and get approved. Monitor your submission, handle any rejections, and connect GMC to Google Ads.",
    icon: "shield",
  },
  {
    value: 5,
    label: "Phase 5: Launch & Scale",
    shortLabel: "Launch",
    description:
      "Launch your Google Shopping campaigns and scale your business. Set budgets, monitor performance, optimize ROAS, and build operational workflows.",
    icon: "chart",
  },
  {
    value: 6,
    label: "Phase 6: Exit",
    shortLabel: "Exit",
    description:
      "Document your business processes, build your financial summary, and plan your exit strategy with your coach.",
    icon: "flag",
  },
] as const;

export function getPhaseLabel(phase: number): string {
  return PHASES.find((p) => p.value === phase)?.label ?? `Phase ${phase}`;
}

export function getPhaseDescription(phase: number): string {
  return PHASES.find((p) => p.value === phase)?.description ?? "";
}
