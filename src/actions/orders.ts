'use server'
import prisma from '@/lib/prisma'
import {Prisma} from '@prisma/client'
import { clearCart } from './cart'
import { revalidatePath } from 'next/cache'
export const createOrder = async (data: Prisma.OrderUncheckedCreateInput[], totalPrice: number) => {

    const studentId = data[0].studentId
    

    await prisma.order.createMany({data})
    await prisma.student.update({where: {id: data[0].studentId}, data: {coins: {decrement: totalPrice}}})
    await clearCart(studentId)

    revalidatePath('/shop/cart')
}