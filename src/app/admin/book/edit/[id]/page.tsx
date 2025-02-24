import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function updateBook(formData: FormData) {
  'use server';

  const id = parseInt(formData.get('id') as string);
  const code = formData.get('code') as string;
  const category = formData.get('category') as string;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const publisherId = parseInt(formData.get('publisherId') as string);

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  await prisma.book.update({
    where: { id },
    data: { code, category, name, price, stock, publisherId }
  });

  revalidatePath('/admin');
  redirect('/admin?section=books');
}

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const prisma = new PrismaClient();
  const bookId = parseInt(params.id);
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });

  if (!book) {
    notFound();
  }

  const publishers = await prisma.publisher.findMany({ orderBy: { id: 'asc' } });

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Edit Book (ID: {bookId})</h1>
      <form action={updateBook} className="space-y-4 max-w-lg">
        <input type="hidden" name="id" value={bookId} />
        <div>
          <label className="block mb-1">Code:</label>
          <input name="code" type="text" defaultValue={book.code} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Category:</label>
          <input name="category" type="text" defaultValue={book.category} className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Name:</label>
          <input name="name" type="text" defaultValue={book.name} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Price:</label>
          <input name="price" type="number" step="any" defaultValue={book.price} className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Stock:</label>
          <input name="stock" type="number" defaultValue={book.stock} className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Publisher:</label>
          <select name="publisherId" defaultValue={book.publisherId.toString()} required className="w-full border border-gray-300 p-2 rounded-md">
            <option value="">--Select Publisher--</option>
            {publishers.map((pub) => (
              <option key={pub.id} value={pub.id}>
                {pub.name}
              </option>
            ))}
          </select>
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Update
        </button>
      </form>
    </main>
  );
}