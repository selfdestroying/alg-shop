'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

export const getProducts = async () => {
  const { isAuth, studentId, organizationId } = await verifySession();
  if (!isAuth || studentId === null || organizationId === null) {
    return [];
  }
  return await prisma.product.findMany({ include: { category: true } });
};
