'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const getCart = async () => {
  const { isAuth, studentId } = await verifySession();
  if (!isAuth || studentId === null) {
    return null;
  }

  return await prisma.cart.findFirst({
    where: { studentId },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { id: 'asc' },
      },
    },
    orderBy: { id: 'asc' },
  });
};

export const addOrUpdateProductInCart = async (
  data: Prisma.CartItemUncheckedCreateInput,
) => {
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: data.cartId, productId: data.productId },
    },
    create: { ...data },
    update: { ...data },
  });

  revalidatePath('/shop');
};

export const removeFromCart = async (id: number) => {
  await prisma.cartItem.delete({ where: { id } });

  revalidatePath('/shop/cart');
};
