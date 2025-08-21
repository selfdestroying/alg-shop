'use server';

import prisma from '@/lib/prisma';
import { verifySession } from '@/lib/session';
import { Prisma } from '@prisma/client';
import { cache } from 'react';

export type StudentData = Prisma.StudentGetPayload<{
  omit: { password: true };
}>;

export const getStudent = cache(async (): Promise<StudentData | null> => {
  const { isAuth, studentId } = await verifySession();
  if (!isAuth || studentId === null) {
    return null;
  }
  const user = await prisma.student.findFirst({
    where: { id: studentId },
    omit: { password: true },
  });
  return user;
});
