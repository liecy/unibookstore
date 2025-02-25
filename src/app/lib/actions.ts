// app/lib/actions.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
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

const bookSchema = z.object({
  id: z.coerce.number().optional(),
  code: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  category: z.string().min(1),
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  publisherId: z.coerce.number().positive()
});

// Publisher validation schema for server-side
const publisherSchema = z.object({
  id: z.coerce.number().optional(),
  code: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  name: z.string().min(2),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1).regex(/^[0-9+\-\s()]{7,20}$/)
});

export async function createBook(formData: FormData) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Parse and validate the input data
    const validatedData = bookSchema.parse({
      code: formData.get('code'),
      category: formData.get('category'),
      name: formData.get('name'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      publisherId: formData.get('publisherId')
    });

    // Create book record
    await prisma.book.create({
      data: validatedData
    });

    revalidatePath('/admin');
    redirect('/admin?section=books');
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A book with this code already exists');
    }
    // Re-throw Zod or other errors
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateBook(formData: FormData) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Parse and validate the input data
    const validatedData = bookSchema.parse({
      id: formData.get('id'),
      code: formData.get('code'),
      category: formData.get('category'),
      name: formData.get('name'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      publisherId: formData.get('publisherId')
    });

    const { id, ...data } = validatedData;

    if (!id) {
      throw new Error('Book ID is required');
    }

    // Update book record
    await prisma.book.update({
      where: { id },
      data
    });

    revalidatePath('/admin');
    redirect('/admin?section=books');
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A book with this code already exists');
    }
    // Re-throw Zod or other errors
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function createPublisher(formData: FormData) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Parse and validate the input data
    const validatedData = publisherSchema.parse({
      code: formData.get('code'),
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      phone: formData.get('phone')
    });

    // Create publisher record
    await prisma.publisher.create({
      data: validatedData
    });

    revalidatePath('/admin');
    redirect('/admin?section=publishers');
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A publisher with this code already exists');
    }
    // Re-throw Zod or other errors
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updatePublisher(formData: FormData) {
  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  try {
    // Parse and validate the input data
    const validatedData = publisherSchema.parse({
      id: formData.get('id'),
      code: formData.get('code'),
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      phone: formData.get('phone')
    });

    const { id, ...data } = validatedData;

    if (!id) {
      throw new Error('Publisher ID is required');
    }

    // Update publisher record
    await prisma.publisher.update({
      where: { id },
      data
    });

    revalidatePath('/admin');
    redirect('/admin?section=publishers');
  } catch (error: any) {
    // Handle Prisma errors
    if (error.code === 'P2002') {
      throw new Error('A publisher with this code already exists');
    }
    // Re-throw Zod or other errors
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}