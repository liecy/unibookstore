import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';

async function createBook(formData: FormData) {
  'use server';

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  const code = formData.get('code') as string;
  const category = formData.get('category') as string;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const publisherId = parseInt(formData.get('publisherId') as string);

  await prisma.book.create({
    data: {
      code,
      category,
      name,
      price,
      stock,
      publisherId,
    },
  });

  
  revalidatePath('/admin');
}

export default async function AddBookPage() {
  const prisma = new PrismaClient();
  const publishers = await prisma.publisher.findMany({
    orderBy: { id: 'asc' },
  });

  return (
    <main style={{ padding: '20px' }}>
      <h1>Add Book</h1>
      <form action={createBook}>
        <div>
          <label>Code: </label>
          <input name="code" type="text" required />
        </div>
        <div>
          <label>Category: </label>
          <input name="category" type="text" />
        </div>
        <div>
          <label>Name: </label>
          <input name="name" type="text" required />
        </div>
        <div>
          <label>Price: </label>
          <input name="price" type="number" step="any" />
        </div>
        <div>
          <label>Stock: </label>
          <input name="stock" type="number" />
        </div>
        <div>
          <label>Publisher: </label>
          <select name="publisherId" required>
            <option value="">--Select Publisher--</option>
            {publishers.map((pub) => (
              <option key={pub.id} value={pub.id}>
                {pub.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit">Create</button>
      </form>
    </main>
  );
}