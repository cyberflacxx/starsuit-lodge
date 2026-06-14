import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CheckResult = {
  label: string;
  passed: boolean;
  details: string;
};

async function run() {
  if (!process.env.DATABASE_URL) {
    console.error(
      "FAIL: DATABASE_URL is missing. Set deployment environment variables before running demo verification.",
    );
    process.exitCode = 1;
    return;
  }

  const [
    branches,
    roomTypes,
    rooms,
    adminUsers,
    services,
    contentBlocks,
  ] = await Promise.all([
    prisma.branch.count(),
    prisma.roomType.count(),
    prisma.room.count(),
    prisma.adminUser.findMany({
      select: {
        email: true,
      },
    }),
    prisma.service.count(),
    prisma.contentBlock.count(),
  ]);

  const demoEmails = new Set(adminUsers.map((user) => user.email));

  const checks: CheckResult[] = [
    {
      label: "Branches",
      passed: branches >= 2,
      details: `${branches} found, expected at least 2.`,
    },
    {
      label: "Room types",
      passed: roomTypes >= 3,
      details: `${roomTypes} found, expected at least 3.`,
    },
    {
      label: "Rooms",
      passed: rooms >= 8,
      details: `${rooms} found, expected at least 8.`,
    },
    {
      label: "Demo admin users",
      passed:
        demoEmails.has("superadmin@starsuitlodges.com") &&
        demoEmails.has("mutare@starsuitlodges.com") &&
        demoEmails.has("chipinge@starsuitlodges.com") &&
        demoEmails.has("reception@starsuitlodges.com"),
      details: "Expected super admin, both branch admins, and reception demo users.",
    },
    {
      label: "Services",
      passed: services > 0,
      details: `${services} found, expected at least 1.`,
    },
    {
      label: "Content blocks",
      passed: contentBlocks > 0,
      details: `${contentBlocks} found, expected at least 1.`,
    },
  ];

  let failed = false;

  for (const check of checks) {
    const prefix = check.passed ? "PASS" : "FAIL";
    console.log(`${prefix}: ${check.label} - ${check.details}`);

    if (!check.passed) {
      failed = true;
    }
  }

  if (failed) {
    process.exitCode = 1;
  } else {
    console.log("PASS: Demo dataset is ready for deployment verification.");
  }
}

run()
  .catch((error) => {
    console.error("FAIL: Demo verification could not complete.", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
