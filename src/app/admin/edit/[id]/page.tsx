import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

const prisma = new PrismaClient();

async function updateBook(formData: FormData) {
  'use server';

  const id = parseInt(formData.get('id') as string);
  const code = formData.get('code') as string;
  const category = formData.get('category') as string;
  const name = formData.get('name') as string;
  const price = parseFloat(formData.get('price') as string);
  const stock = parseInt(formData.get('stock') as string);
  const publisherId = parseInt(formData.get('publisherId') as string);

  await prisma.book.update({
    where: { id },
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
  redirect('/admin');
}

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const bookId = parseInt(params.id);
  const book = await prisma.book.findUnique({
    where: { id: bookId },
  });

  if (!book) {
    notFound();
  }

  const publishers = await prisma.publisher.findMany({
    orderBy: { id: 'asc' },
  });

  return (
    <main style={{ padding: '20px' }}>
      <h1>Edit Book (ID: {bookId})</h1>
      <form action={updateBook}>
        {/* Hidden input to send book ID */}
        <input type="hidden" name="id" value={bookId} />

        <div>
          <label>Code: </label>
          <input name="code" type="text" defaultValue={book.code} required />
        </div>
        <div>
          <label>Category: </label>
          <input name="category" type="text" defaultValue={book.category} />
        </div>
        <div>
          <label>Name: </label>
          <input name="name" type="text" defaultValue={book.name} required />
        </div>
        <div>
          <label>Price: </label>
          <input name="price" type="number" step="any" defaultValue={book.price} />
        </div>
        <div>
          <label>Stock: </label>
          <input name="stock" type="number" defaultValue={book.stock} />
        </div>
        <div>
          <label>Publisher: </label>
          <select name="publisherId" defaultValue={book.publisherId.toString()} required>
            <option value="">--Select Publisher--</option>
            {publishers.map((pub) => (
              <option key={pub.id} value={pub.id}>
                {pub.name}
              </option>
            ))}
          </select>
        </div>

        <button type="submit">Update</button>
      </form>
    </main>
  );
}