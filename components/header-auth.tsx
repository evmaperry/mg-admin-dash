import { signOutAction } from '@/app/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/server';
import { DoorOpen, Eraser, LogOut, Menu, Pencil } from 'lucide-react';
import {
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuContent,
  // DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

export default async function AuthButton() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!hasEnvVars) {
    return (
      <>
        <div className='flex gap-4 items-center'>
          <div>
            <Badge
              variant={'default'}
              className='font-normal pointer-events-none'
            >
              Please update .env.local file with anon key and url
            </Badge>
          </div>
          <div className='flex gap-2'>
            <Button
              asChild
              size='sm'
              variant={'outline'}
              disabled
              className='opacity-75 cursor-none pointer-events-none'
            >
              <Link href='/sign-in'>Sign in</Link>
            </Button>
            <Button
              asChild
              size='sm'
              variant={'default'}
              disabled
              className='opacity-75 cursor-none pointer-events-none'
            >
              <Link href='/sign-up'>Sign up</Link>
            </Button>
          </div>
        </div>
      </>
    );
  }
  return user ? (
    <div className='flex items-center gap-4'>
      <DropdownMenu>
        <DropdownMenuTrigger>
          <Menu size={28} />
        </DropdownMenuTrigger>
        <DropdownMenuContent className='mr-12 px-4'>
          <DropdownMenuItem>{user.email}</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <form
              action={signOutAction}
              className='flex flex-row items-center justify-between w-full'
            >
              <LogOut />
              <div>Sign out</div>
            </form>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={'/dashboard/reset-password'}
              className='flex flex-row items-center justify-between w-full'
            >
              <Pencil />
              Change password
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  ) : (
    <div className='flex gap-2'>
      <Button asChild size='sm' variant={'outline'}>
        <Link href='/sign-in'>Sign in</Link>
      </Button>
      <Button asChild size='sm' variant={'default'}>
        <Link href='/sign-up'>Sign up</Link>
      </Button>
    </div>
  );
}
