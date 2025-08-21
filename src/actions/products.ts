'use server';

import prisma from '@/lib/prisma';



export const getProducts = async () => {
  return await prisma.product.findMany({ include: { category: true } });
};
