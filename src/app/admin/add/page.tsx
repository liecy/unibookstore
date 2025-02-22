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
    data: { code, category, name, price, stock, publisherId }
  });

  revalidatePath('/admin');
}

export default async function AddBookPage() {
  const prisma = new PrismaClient();
  const publishers = await prisma.publisher.findMany({ orderBy: { id: 'asc' } });

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Add Book</h1>
      <form action={createBook} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1">Code:</label>
          <input name="code" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Category:</label>
          <input name="category" type="text" className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Name:</label>
          <input name="name" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Price:</label>
          <input name="price" type="number" step="any" className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Stock:</label>
          <input name="stock" type="number" className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Publisher:</label>
          <select name="publisherId" required className="w-full border border-gray-300 p-2 rounded-md">
            <option value="">--Select Publisher--</option>
            {publishers.map((pub) => (
              <option key={pub.id} value={pub.id}>
                {pub.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create
        </button>
      </form>
    </main>
  );
}