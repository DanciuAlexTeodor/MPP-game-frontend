import { Suspense } from 'react';
import AddGameForm from '@/components/AddGameForm';
import Loading from './loading';

export default function AddGamePage() {
  return (
    <Suspense fallback={<Loading />}>
      <AddGameForm />
    </Suspense>
  );
}
