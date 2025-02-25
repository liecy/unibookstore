import { prisma } from '@/app/lib/prisma';
import Link from 'next/link';
import BookDeleteButton from './BookDeleteButton';
import PublisherDeleteButton from './PublisherDeleteButton';


export default async function AdminPage({ searchParams }: { searchParams?: { section?: string; search?: string } }) {
  const resolvedSearchParams = await Promise.resolve(searchParams);
  const section = resolvedSearchParams?.section || 'books';
  const search = resolvedSearchParams?.search || '';

  return (
    <main className="p-6 bg-gray-50 min-h-screen">
      {/* Navigation Tabs */}
      <div className="mb-6 flex items-center space-x-4">
        <Link
          href="/admin?section=books"
          className={`px-4 py-2 rounded-md ${
            section === 'books' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Books
        </Link>
        <Link
          href="/admin?section=publishers"
          className={`px-4 py-2 rounded-md ${
            section === 'publishers' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          Publishers
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">
        Admin - Manage {section === 'books' ? 'Books' : 'Publishers'}
      </h1>

      {section === 'books' ? <BooksSection search={search} /> : <PublishersSection search={search} />}
    </main>
  );
}

async function BooksSection({ search }: { search: string }) {
  const books = await prisma.book.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { category: { contains: search, mode: 'insensitive' } },
      ],
    },
    include: { publisher: true },
    orderBy: { id: 'asc' },
  });

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <form method="GET" className="flex items-center gap-2">
          <input type="hidden" name="section" value="books" />
          <input
            type="text"
            name="search"
            placeholder="Search by name, code, or category"
            defaultValue={search}
            className="border border-gray-300 p-2 rounded-md w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <Link
          href="/admin/book/add"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Book
        </Link>
      </div>
      <table className="min-w-full bg-white border border-gray-200 mx-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center">Code</th>
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Category</th>
            <th className="py-2 px-4 border-b text-center">Price</th>
            <th className="py-2 px-4 border-b text-center">Stock</th>
            <th className="py-2 px-4 border-b text-center">Publisher</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
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
              <td className="py-2 px-4 border-b text-center space-x-2">
                <Link href={`/admin/book/edit/${book.id}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
                <BookDeleteButton id={book.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

async function PublishersSection({ search }: { search: string }) {
  const publishers = await prisma.publisher.findMany({
    where: {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
      ],
    },
    orderBy: { id: 'asc' },
  });

  return (
    <>
      <div className="mb-6 flex flex-col sm:flex-row items-center gap-4">
        <form method="GET" className="flex items-center gap-2">
          <input type="hidden" name="section" value="publishers" />
          <input
            type="text"
            name="search"
            placeholder="Search publishers by name, code, address, city, or phone"
            defaultValue={search}
            className="border border-gray-300 p-2 rounded-md w-64"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Search
          </button>
        </form>
        <Link
          href="admin/publisher/add"
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Add Publisher
        </Link>
      </div>
      <table className="min-w-full bg-white border border-gray-200 mx-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="py-2 px-4 border-b text-center">Code</th>
            <th className="py-2 px-4 border-b text-center">Name</th>
            <th className="py-2 px-4 border-b text-center">Address</th>
            <th className="py-2 px-4 border-b text-center">City</th>
            <th className="py-2 px-4 border-b text-center">Phone</th>
            <th className="py-2 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {publishers.map((pub) => (
            <tr key={pub.id} className="hover:bg-gray-50">
              <td className="py-2 px-4 border-b text-center">{pub.code}</td>
              <td className="py-2 px-4 border-b text-center">{pub.name}</td>
              <td className="py-2 px-4 border-b text-center">{pub.address}</td>
              <td className="py-2 px-4 border-b text-center">{pub.city}</td>
              <td className="py-2 px-4 border-b text-center">{pub.phone}</td>
              <td className="py-2 px-4 border-b text-center space-x-2">
                <Link href={`/admin/publisher/edit/${pub.id}`} className="text-blue-500 hover:underline">
                  Edit
                </Link>
                <PublisherDeleteButton id={pub.id} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}