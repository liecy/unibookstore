import { prisma } from '@/app/lib/prisma';
import BookForm from '@/app/components/BookForm';
import { createBook } from '@/app/lib/actions';

export default async function AddBookPage() {
  const publishers = await prisma.publisher.findMany({ 
    orderBy: { id: 'asc' } 
  });

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Add Book</h1>
      <BookForm publishers={publishers} action={createBook} />
    </main>
  );
}