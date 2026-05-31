import "server-only";
import { PrismaClient } from "@prisma/client";

/**
 * Singleton Prisma client. In serverless/dev with hot reload, a new client per
 * invocation would exhaust the connection pool — so we cache one on globalThis.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
