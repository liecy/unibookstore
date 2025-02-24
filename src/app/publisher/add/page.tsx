import { PrismaClient } from '@prisma/client';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

async function createPublisher(formData: FormData) {
  'use server';

  const { PrismaClient } = await import('@prisma/client');
  const prisma = new PrismaClient();

  const code = formData.get('code') as string;
  const name = formData.get('name') as string;
  const address = formData.get('address') as string;
  const city = formData.get('city') as string;
  const phone = formData.get('phone') as string;

  await prisma.publisher.create({
    data: { code, name, address, city, phone },
  });

  revalidatePath('/publisher');
  redirect('/admin?section=publishers');
}

export default async function AddPublisherPage() {
  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Add Publisher</h1>
      <form action={createPublisher} className="space-y-4 max-w-lg">
        <div>
          <label className="block mb-1">Code:</label>
          <input name="code" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Name:</label>
          <input name="name" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Address:</label>
          <input name="address" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">City:</label>
          <input name="city" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <div>
          <label className="block mb-1">Phone:</label>
          <input name="phone" type="text" required className="w-full border border-gray-300 p-2 rounded-md" />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">
          Create Publisher
        </button>
      </form>
    </main>
  );
}
