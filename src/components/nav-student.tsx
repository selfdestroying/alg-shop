import { signout } from '@/actions/auth';
import { getStudent } from '@/actions/students';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Box,
  Boxes,
  ChevronsUpDown,
  LogOut,
  Package,
  PackageCheck,
  Sparkles,
  User,
} from 'lucide-react';
import { redirect } from 'next/navigation';
import { Button } from './ui/button';
import Link from 'next/link';

export async function NavStudent() {
  const student = await getStudent();
  if (!student) {
    return redirect('/auth');
  }
  const onLogout = async () => {
    'use server';
    await signout();
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={'ghost'}>
          <Avatar>
            <AvatarImage src={'/placeholder.svg'} alt={student.firstName} />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <span className="hidden md:inline">
            {student.firstName} {student.lastName}
          </span>
          <ChevronsUpDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-(--radix-dropdown-menu-trigger-width)"
        side="top"
        align="start"
      >
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link href={'/shop/profile'}>
              <User />
              Профиль
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href={'/shop/orders'}>
              <Package />
              Мои заказы
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut />
            Выйти
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
