import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function Home({ searchParams }: { searchParams?: { search?: string } }) {
  const search = searchParams?.search || '';

  const books = await prisma.book.findMany({
    where: {
      name: {
        contains: search,
        mode: 'insensitive'
      }
    },
    include: {
      publisher: true
    },
    orderBy: {
      name: 'asc'
    }
  });

  return (
    <main style={{ padding: '20px' }}>
      <h1>HOME - Daftar Buku</h1>
      <form method="GET">
        <input
          type="text"
          name="search"
          placeholder="Cari nama buku..."
          defaultValue={search}
        />
        <button type="submit">Search</button>
      </form>

      <table border={1} cellPadding={5} style={{ marginTop: '20px' }}>
        <thead>
          <tr>
            <th>Kode</th>
            <th>Nama Buku</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Penerbit</th>
          </tr>
        </thead>
        <tbody>
          {books.map((b) => (
            <tr key={b.id}>
              <td>{b.code}</td>
              <td>{b.name}</td>
              <td>{b.category}</td>
              <td>{b.price}</td>
              <td>{b.stock}</td>
              <td>{b.publisher.name}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}