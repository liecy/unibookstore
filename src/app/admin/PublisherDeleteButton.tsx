'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deletePublisher } from './actions';

export default function PublisherDeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deletePublisher(id);
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isPending}
      className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
    >
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}