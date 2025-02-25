import PublisherForm from '@/app/components/PublisherForm';
import { createPublisher } from '@/app/lib/actions';

export default async function AddPublisherPage() {
  return (
    <main className="p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-6">Add Publisher</h1>
      <PublisherForm action={createPublisher} />
    </main>
  );
}