import { PrismaClient } from '@prisma/client';
import Link from 'next/link';

const prisma = new PrismaClient();

export default async function Home({ searchParams }: { searchParams?: { search?: string } }) {
  const { search = '' } = await searchParams || {};

  const books = await prisma.book.findMany({
    where: {
      name: { contains: search, mode: 'insensitive' }
    },
    include: { publisher: true },
    orderBy: { name: 'asc' }
  });

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Home - Book List</h1>
      <form method="GET" className="mb-6">
        <input
          type="text"
          name="search"
          placeholder="Search book name..."
          defaultValue={search}
          className="border border-gray-300 rounded-md p-2 mr-2 w-64"
        />
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Search
        </button>
      </form>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Code</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Category</th>
            <th className="py-2 px-4 border-b">Price</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">{book.code}</td>
              <td className="py-2 px-4 border-b">{book.name}</td>
              <td className="py-2 px-4 border-b text-center">{book.category}</td>
              <td className="py-2 px-4 border-b text-center">{book.price}</td>
              <td className="py-2 px-4 border-b text-center">{book.stock}</td>
              <td className="py-2 px-4 border-b text-center">{book.publisher?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}