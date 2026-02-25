'use server';
import prisma from '@/lib/prisma';
import { signInFormSchema } from '@/schemas/auth';
import { redirect } from 'next/navigation';
import { createSession, deleteSession } from '../lib/session';

export async function sigin(
  state: { success: boolean; message: string } | undefined,
  formData: FormData,
): Promise<{ success: boolean; message: string } | undefined> {
  const validatedFields = signInFormSchema.safeParse({
    login: formData.get('login'),
    password: formData.get('password'),
  });

  if (!validatedFields.success) {
    return { success: false, message: validatedFields.error.message };
  }

  const { login, password } = validatedFields.data;

  const student = await prisma.student.findFirst({ where: { login } });
  if (!student) {
    return { success: false, message: 'User not found' };
  }

  const isValidPassword = password == student.password;
  if (!isValidPassword) {
    return { success: false, message: 'Invalid password' };
  }

  await createSession(student.id, student.organizationId);
  redirect('/shop');
}

export async function signout() {
  await deleteSession();
  redirect('/auth');
}
