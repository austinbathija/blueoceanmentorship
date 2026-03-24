import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const checklistItems = [
  // Phase 0 — Introduction & Mindset
  { text: "Watch Phase 0 video series", phase: 0, sortOrder: 0 },
  { text: "Complete the Entropy Audit worksheet", phase: 0, sortOrder: 1 },
  { text: "Set up workspace and tools", phase: 0, sortOrder: 2 },
  { text: "Join the community", phase: 0, sortOrder: 3 },

  // Phase 1 — Essentials
  { text: "Understand Google Merchant Center fundamentals", phase: 1, sortOrder: 0 },
  { text: "Create Google accounts (Ads, GMC, Analytics)", phase: 1, sortOrder: 1 },
  { text: "Set up Shopify store", phase: 1, sortOrder: 2 },
  { text: "Purchase domain (must age 14+ days before GMC submission)", phase: 1, sortOrder: 3 },
  { text: "Set up branded email on your domain", phase: 1, sortOrder: 4 },
  { text: "Confirm all accounts created — screenshot to coach", phase: 1, sortOrder: 5 },

  // Phase 2 — Research & Foundation
  { text: "Watch Phase 2 video series", phase: 2, sortOrder: 0 },
  { text: "Run GAP analysis on 3+ niches", phase: 2, sortOrder: 1 },
  { text: "Identify primary niche with supporting data", phase: 2, sortOrder: 2 },
  { text: "Find 50+ products from suppliers", phase: 2, sortOrder: 3 },
  { text: "Submit niche and product research to coach for review", phase: 2, sortOrder: 4 },

  // Phase 3 — Build Your Store
  { text: "Watch Phase 3 video series", phase: 3, sortOrder: 0 },
  { text: "Import products (minimum 50 SKUs)", phase: 3, sortOrder: 1 },
  { text: "Write and optimize product descriptions", phase: 3, sortOrder: 2 },
  { text: "Set up policy pages (refund, shipping, privacy, terms)", phase: 3, sortOrder: 3 },
  { text: "Set up branded social media profiles (15+ posts minimum)", phase: 3, sortOrder: 4 },
  { text: "Configure payment processing", phase: 3, sortOrder: 5 },
  { text: "Set up Google Analytics and conversion tracking", phase: 3, sortOrder: 6 },
  { text: "Submit store URL to coach for pre-GMC review", phase: 3, sortOrder: 7 },
  { text: "Apply coach feedback and fixes", phase: 3, sortOrder: 8 },
  { text: "Final store review passed", phase: 3, sortOrder: 9 },

  // Phase 4 — GMC Approval
  { text: "Watch Phase 4 video series", phase: 4, sortOrder: 0 },
  { text: "Verify domain is 14+ days old", phase: 4, sortOrder: 1 },
  { text: "Submit store to Google Merchant Center", phase: 4, sortOrder: 2 },
  { text: "Monitor GMC status daily", phase: 4, sortOrder: 3 },
  { text: "If rejected — diagnose issue and contact coach", phase: 4, sortOrder: 4 },
  { text: "GMC APPROVED", phase: 4, sortOrder: 5 },
  { text: "Wait 48 hours post-approval before launching ads", phase: 4, sortOrder: 6 },
  { text: "Connect GMC to Google Ads", phase: 4, sortOrder: 7 },

  // Phase 5 — Launch & Scale
  { text: "Watch Phase 5 video series", phase: 5, sortOrder: 0 },
  { text: "Set up Google Shopping campaign structure", phase: 5, sortOrder: 1 },
  { text: "Set initial daily budget", phase: 5, sortOrder: 2 },
  { text: "Launch campaigns", phase: 5, sortOrder: 3 },
  { text: "Monitor for 7 days without making changes", phase: 5, sortOrder: 4 },
  { text: "Hit $200 ad spend — book performance review with coach", phase: 5, sortOrder: 5 },
  { text: "Implement optimization recommendations", phase: 5, sortOrder: 6 },
  { text: "Scale budget based on ROAS targets", phase: 5, sortOrder: 7 },
  { text: "Set up order fulfillment workflow", phase: 5, sortOrder: 8 },
  { text: "Implement customer service SOPs", phase: 5, sortOrder: 9 },
  { text: "Set up VA or automation for repetitive tasks", phase: 5, sortOrder: 10 },

  // Phase 6 — Exit
  { text: "Watch Phase 6 video series", phase: 6, sortOrder: 0 },
  { text: "Document all SOPs and processes", phase: 6, sortOrder: 1 },
  { text: "Build financial summary (P&L, revenue trends)", phase: 6, sortOrder: 2 },
  { text: "Exit strategy discussion with coach", phase: 6, sortOrder: 3 },
];

async function main() {
  console.log("Seeding checklist items...");

  for (const item of checklistItems) {
    await prisma.checklistItem.upsert({
      where: {
        id: `seed-phase${item.phase}-${item.sortOrder}`,
      },
      update: {
        text: item.text,
        phase: item.phase,
        sortOrder: item.sortOrder,
      },
      create: {
        id: `seed-phase${item.phase}-${item.sortOrder}`,
        text: item.text,
        phase: item.phase,
        sortOrder: item.sortOrder,
      },
    });
  }

  console.log(`Seeded ${checklistItems.length} checklist items.`);

  // Create a default invite code for testing
  await prisma.inviteCode.upsert({
    where: { code: "BLUEOCEAN" },
    update: {},
    create: {
      code: "BLUEOCEAN",
      used: false,
    },
  });

  console.log("Created test invite code: BLUEOCEAN");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
