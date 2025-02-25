'use server';

import { prisma } from '@/app/lib/prisma';

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