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
import { ChevronsUpDown, Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';
import { Button } from './ui/button';

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
      <DropdownMenuContent align="end" sideOffset={4}>
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <Sparkles />
            Upgrade to Pro
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
