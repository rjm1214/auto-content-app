import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient({
  log: ['query', 'error'],
});

// Optional: close gracefully on process exit
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});
