import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
import DeleteButton from './DeleteButton';

const prisma = new PrismaClient();

export default async function AdminPage() {
  const books = await prisma.book.findMany({
    include: { publisher: true },
    orderBy: { id: 'asc' },
  });

  return (
    <main style={{ padding: '20px' }}>
      <h1>ADMIN - Manage Books</h1>
      <Link href="/admin/add">Add Book</Link>
      <table border={1} cellPadding={5} style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Code</th>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Stock</th>
            <th>Publisher</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.id}</td>
              <td>{b.code}</td>
              <td>{b.name}</td>
              <td>{b.category}</td>
              <td>{b.price}</td>
              <td>{b.stock}</td>
              <td>{b.publisher?.name}</td>
              <td>
                <Link href={`/admin/edit/${b.id}`}>Edit</Link>
                {' | '}
                <DeleteButton id={b.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}