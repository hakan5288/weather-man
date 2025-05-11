import { PrismaClient } from '@/generated/prisma';

declare global {
  interface Global {
    prisma?: PrismaClient;
  }
}

// Use globalThis with proper typing
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'info', 'warn', 'error'], // Log queries for debugging
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

export default prisma;