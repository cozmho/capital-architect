import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

let _real: PrismaClient | null = null;

export function getPrismaClient(): PrismaClient {
  if (globalForPrisma.prisma) {
    return globalForPrisma.prisma;
  }

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    // Return a proxy that throws only when a method is actually invoked,
    // so module-level `const prisma = getPrismaClient()` doesn't fail at build time.
    const msg = "DATABASE_URL is not configured. Set it in your environment.";
    return new Proxy({} as PrismaClient, {
      get(_target, prop) {
        if (prop === Symbol.toPrimitive) return () => "PrismaClient(unconfigured)";
        throw new Error(msg);
      },
    });
  }

  const pool = new pg.Pool({ connectionString });
  const adapter = new PrismaPg(pool);
  const client = new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

  globalForPrisma.prisma = client;
  _real = client;
  return client;
}
