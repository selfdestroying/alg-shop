import { getCart } from '@/actions/cart';
import { getStudent } from '@/actions/students';
import { NavStudent } from '@/components/nav-student';
import { Badge } from '@/components/ui/badge';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Button } from '@/components/ui/button';
import { Coins, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { ReactNode } from 'react';

export default async function Layout({ children }: { children: ReactNode }) {
  const student = await getStudent();
  if (!student) {
    return redirect('/auth');
  }
  const cart = await getCart();
  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <header>
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink href="/">Home</BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>Store</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
              <div className="flex items-center gap-2">
                <Button variant={'outline'} className="relative" asChild>
                  <Link href={'/shop/cart'}>
                    <ShoppingCart />
                    <Badge variant={'outline'} className="">
                      {cart?.items.length}
                    </Badge>
                  </Link>
                </Button>
                <Badge className="flex items-center gap-2 h-9 text-sm">
                  <Coins size={12} />
                  <span>{student.coins}</span>
                </Badge>
                <NavStudent />
              </div>
            </div>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}
