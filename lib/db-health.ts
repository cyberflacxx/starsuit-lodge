import { prisma } from "@/lib/prisma";

export async function checkDatabaseConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return {
      ok: true,
      message: "Database connection is available.",
    };
  } catch {
    return {
      ok: false,
      message: "Database connection is unavailable or not configured.",
    };
  }
}
