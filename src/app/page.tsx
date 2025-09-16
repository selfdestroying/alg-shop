import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex items-center justify-center h-screen">
      <Button asChild variant={'outline'}>
        <Link href={'/shop'}>В магазин</Link>
      </Button>
    </div>
  );
}
