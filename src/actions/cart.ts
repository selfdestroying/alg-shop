'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';

export const getCart = async () => {
  const { isAuth, studentId, organizationId } = await verifySession();
  if (!isAuth || studentId === null || organizationId === null) {
    return null;
  }

  let cart;

  cart = await prisma.cart.findFirst({
    where: { studentId, organizationId },
    include: {
      items: {
        include: { product: { include: { category: true } } },
        orderBy: { id: 'asc' },
      },
    },
    orderBy: { id: 'asc' },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: {
        studentId,
        organizationId,
      },
      include: {
        items: {
          include: { product: { include: { category: true } } },
          orderBy: { id: 'asc' },
        },
      },
    });
  }

  return cart;
};

export const addOrUpdateProductInCart = async (
  data: Prisma.CartItemUncheckedCreateInput,
  operation: 'increment' | 'decrement',
) => {
  await prisma.cartItem.upsert({
    where: {
      cartId_productId: { cartId: data.cartId, productId: data.productId },
    },
    create: { ...data },
    update: { ...data },
  });

  await prisma.product.update({
    where: {
      id: data.productId,
    },
    data: {
      quantity: operation == 'increment' ? { increment: 1 } : { decrement: 1 },
    },
  });

  revalidatePath('/shop');
};

export const removeFromCart = async (id: number) => {
  const { productId } = await prisma.cartItem.delete({ where: { id } });
  await prisma.product.update({
    where: { id: productId },
    data: { quantity: { increment: 1 } },
  });
  revalidatePath('/shop/cart');
};

export const clearCart = async (studentId: number, organizationId: number) => {
  await prisma.cartItem.deleteMany({
    where: {
      cart: {
        studentId,
        organizationId,
      },
    },
  });
  revalidatePath('/shop/cart');
};
