'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function deleteBook(id: number) {
  await prisma.book.delete({
    where: { id },
  });
}