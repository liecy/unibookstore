'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';

const bookSchema = z.object({
  id: z.coerce.number().optional(),
  code: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  category: z.string().min(1),
  name: z.string().min(2),
  price: z.coerce.number().min(0),
  stock: z.coerce.number().int().min(0),
  publisherId: z.coerce.number().positive()
});

const publisherSchema = z.object({
  id: z.coerce.number().optional(),
  code: z.string().min(1).regex(/^[a-zA-Z0-9-]+$/),
  name: z.string().min(2),
  address: z.string().min(1),
  city: z.string().min(1),
  phone: z.string().min(1).regex(/^[0-9+\-\s()]{7,20}$/)
});

export async function deleteBook(id: number) {
  await prisma.book.delete({
    where: { id },
  });
  
  revalidatePath('/admin');
}

export async function deletePublisher(id: number) {
  try {
    await prisma.publisher.delete({
      where: { id },
    });
    
    revalidatePath('/admin');
  } catch (error: any) {
    if (error.code === 'P2003') {
      throw new Error('Cannot delete publisher because it still has books. Delete the books first or reassign them to another publisher.');
    }
    throw error;
  }
}

export async function createBook(formData: FormData) {
  try {
    const validatedData = bookSchema.parse({
      code: formData.get('code'),
      category: formData.get('category'),
      name: formData.get('name'),
      price: formData.get('price'),
      stock: formData.get('stock'),
      publisherId: formData.get('publisherId')
    });

    await prisma.book.create({
      data: validatedData
    });

    revalidatePath('/admin');
    redirect('/admin?section=books');
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('A book with this code already exists');
    }
    throw error;
  }
}

export async function updateBook(formData: FormData) {
  try {
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

    await prisma.book.update({
      where: { id },
      data
    });

    revalidatePath('/admin');
    redirect('/admin?section=books');
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('A book with this code already exists');
    }
    throw error;
  }
}

export async function createPublisher(formData: FormData) {
  try {
    const validatedData = publisherSchema.parse({
      code: formData.get('code'),
      name: formData.get('name'),
      address: formData.get('address'),
      city: formData.get('city'),
      phone: formData.get('phone')
    });

    await prisma.publisher.create({
      data: validatedData
    });

    revalidatePath('/admin');
    redirect('/admin?section=publishers');
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('A publisher with this code already exists');
    }
    throw error;
  }
}

export async function updatePublisher(formData: FormData) {
  try {
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

    await prisma.publisher.update({
      where: { id },
      data
    });

    revalidatePath('/admin');
    redirect('/admin?section=publishers');
  } catch (error: any) {
    if (error.code === 'P2002') {
      throw new Error('A publisher with this code already exists');
    }
    throw error;
  }
}