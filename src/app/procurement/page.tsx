import { prisma } from '@/app/lib/prisma';

export default async function ProcurementPage() {
  const books = await prisma.book.findMany({
    orderBy: { stock: 'asc' },
    take: 5,
    include: { publisher: true }
  });

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Procurement - Low Stock Books</h1>
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b">Code</th>
            <th className="py-2 px-4 border-b">Name</th>
            <th className="py-2 px-4 border-b">Stock</th>
            <th className="py-2 px-4 border-b">Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map((book) => (
            <tr key={book.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">{book.code}</td>
              <td className="py-2 px-4 border-b">{book.name}</td>
              <td className="py-2 px-4 border-b text-center">{book.stock}</td>
              <td className="py-2 px-4 border-b text-center">{book.publisher?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}