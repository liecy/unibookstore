import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function ProcurementPage() {
  const books = await prisma.book.findMany({
    orderBy: { stock: 'asc' },
    take: 5,
    include: { publisher: true },
  });

  return (
    <main style={{ padding: '20px' }}>
      <h1>Procurement - Low Stock Books</h1>
      <table border={1} cellPadding={5}>
        <thead>
          <tr>
            <th>Code</th>
            <th>Name</th>
            <th>Stock</th>
            <th>Publisher</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.code}</td>
              <td>{b.name}</td>
              <td>{b.stock}</td>
              <td>{b.publisher?.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}