'use server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { clearCart } from './cart';

export const getOrders = async (data: Prisma.OrderFindManyArgs) => {
  const orders = await prisma.order.findMany({
    ...data,
    include: { product: true },
  });

  return orders;
};

export const createOrder = async (
  data: Prisma.OrderUncheckedCreateInput[],
  totalPrice: number,
) => {
  const studentId = data[0].studentId;
  const organizationId = data[0].organizationId;
  await prisma.order.createMany({ data });
  await prisma.student.update({
    where: { id: data[0].studentId },
    data: { coins: { decrement: totalPrice } },
  });
  await clearCart(studentId, organizationId ?? -1);

  revalidatePath('/shop/cart');
};
