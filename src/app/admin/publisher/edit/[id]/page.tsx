import { prisma } from '@/app/lib/prisma';
import { notFound } from 'next/navigation';
import PublisherForm from '@/app/components/PublisherForm';
import { updatePublisher } from '@/app/lib/actions';

export default async function EditPublisherPage({ params }: { params: { id: string } }) {
  const publisherId = parseInt(params.id);
  
  const publisher = await prisma.publisher.findUnique({
    where: { id: publisherId },
  });

  if (!publisher) {
    notFound();
  }

  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Edit Publisher</h1>
      <PublisherForm publisher={publisher} action={updatePublisher} />
    </main>
  );
}