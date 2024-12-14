import prisma from '../db/prisma';

export async function withTransaction<T>(
  callback: (tx: typeof prisma) => Promise<T>
): Promise<T> {
  try {
    return await prisma.$transaction(async (tx) => {
      return await callback(tx);
    });
  } catch (error) {
    console.error('Transaction failed:', error);
    throw error;
  }
}

export async function healthCheck(): Promise<boolean> {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
}