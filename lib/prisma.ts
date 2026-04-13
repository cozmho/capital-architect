import { PrismaClient } from "@prisma/client";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

let prismaClient: PrismaClient;

if (globalForPrisma.prisma) {
  prismaClient = globalForPrisma.prisma;
} else {
  // Use connection pooling to interact with Supabase natively on Vercel
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const adapter = new PrismaPg(pool);
  
  prismaClient = new PrismaClient({ adapter, log: ["query"] });
}

export const prisma = prismaClient;

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
