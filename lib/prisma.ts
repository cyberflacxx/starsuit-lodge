import { PrismaClient } from "@prisma/client";

declare global {
  // Prevent multiple Prisma clients during Next.js hot reload in development.
  var __starsuitPrisma__: PrismaClient | undefined;
}

export const prisma =
  globalThis.__starsuitPrisma__ ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalThis.__starsuitPrisma__ = prisma;
}
