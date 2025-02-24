import { PrismaClient } from '@prisma/client';
import { notFound, redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

async function updatePublisher(formData: FormData) {
  'use server';

  const id = parseInt(formData.get('id') as string);
  const code = formData.get('code') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const phone = formData.get('phone') as string;

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  await prisma.publisher.update({
    where: { id },
    data: { code, name, address, city, phone },
  });

  revalidatePath('/publisher');
  redirect('/publisher');
}

export default async function EditPublisherPage({ params }: { params: { id: string } }) {
  const publisherId = parseInt(params.id);
  const prisma = new PrismaClient();
  const publisher = await prisma.publisher.findUnique({
    where: { id: publisherId },
  });

  if (!publisher) {
    notFound();
  }

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Edit Publisher (ID: {publisherId})</h1>
      <form action={updatePublisher} className="space-y-4 max-w-lg">
        <input type="hidden" name="id" value={publisherId} />
        <div>
          <label className="block mb-1">Code:</label>
          <input name="code" type="text" defaultValue={publisher.code} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Name:</label>
          <input name="name" type="text" defaultValue={publisher.name} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Address:</label>
          <input name="address" type="text" defaultValue={publisher.address} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">City:</label>
          <input name="city" type="text" defaultValue={publisher.city} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Phone:</label>
          <input name="phone" type="text" defaultValue={publisher.phone} required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Update Publisher
        </button>
      </form>
    </main>
  );
}