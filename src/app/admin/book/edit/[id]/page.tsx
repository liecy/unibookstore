import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import BookForm from '@/app/components/BookForm';
import { updateBook } from '@/app/lib/actions';

export default async function EditBookPage({ params }: { params: { id: string } }) {
  const bookId = parseInt(params.id);
  const book = await prisma.book.findUnique({
    where: { id: bookId }
  });

  if (!book) {
    notFound();
  }

  const publishers = await prisma.publisher.findMany({ 
    orderBy: { id: 'asc' } 
  });

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Edit Book</h1>
      <BookForm publishers={publishers} book={book} action={updateBook} />
    </main>
  );
}