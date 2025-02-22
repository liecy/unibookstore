'use client';

import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { deleteBook } from './actions';

export default function DeleteButton({ id }: { id: number }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await deleteBook(id);
      router.refresh();
    });
  }

  return (
    <button onClick={handleDelete} disabled={isPending}>
      {isPending ? 'Deleting...' : 'Delete'}
    </button>
  );
}