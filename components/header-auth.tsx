import { signOutAction } from '@/app/actions';
import { hasEnvVars } from '@/utils/supabase/check-env-vars';
import Link from 'next/link';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { createClient } from '@/utils/supabase/server';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { DoorOpen, Eraser, LogOut, Menu, Pencil } from 'lucide-react';

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
      <Menubar>
        <MenubarMenu>
          <MenubarTrigger>
            <Menu size={18} />
          </MenubarTrigger>
          <MenubarContent className='mr-12 px-4'>
            <MenubarItem>{user.email}</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              <form
                action={signOutAction}
                className='flex flex-row items-center justify-between w-full'
              >
                <LogOut />
                <div>Sign out</div>
              </form>
            </MenubarItem>
            <MenubarItem>
              <Link href={'/dashboard/reset-password'} className='flex flex-row items-center justify-between w-full'><Pencil />Change password</Link>
            </MenubarItem>
            {/* <MenubarItem disabled>New Incognito Window</MenubarItem>
            <MenubarSub>
              <MenubarSubTrigger>Share</MenubarSubTrigger>
              <MenubarSubContent>
                <MenubarItem>Email link</MenubarItem>
                <MenubarItem>Messages</MenubarItem>
                <MenubarItem>Notes</MenubarItem>
              </MenubarSubContent>
            </MenubarSub>
            <MenubarSeparator />
            <MenubarItem>
              Print... <MenubarShortcut>⌘P</MenubarShortcut>
            </MenubarItem> */}
          </MenubarContent>
        </MenubarMenu>
      </Menubar>
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
