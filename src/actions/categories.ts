'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';

export const getCategories = async () => {
  const { isAuth, studentId, organizationId } = await verifySession();
  if (!isAuth || studentId === null || organizationId === null) {
    return [];
  }
  return await prisma.category.findMany({ where: { organizationId } });
};
