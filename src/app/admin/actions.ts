'use server';

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function deleteBook(id: number) {
  await prisma.book.delete({
    where: { id },
  });
}

export async function deletePublisher(id: number) {
  await prisma.publisher.delete({
    where: { id },
  });
}