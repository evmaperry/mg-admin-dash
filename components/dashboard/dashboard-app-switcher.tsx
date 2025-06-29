'use client';

import * as React from 'react';
import {
  AppWindow,
  Check,
  ChevronsUpDown,
  GalleryVerticalEnd,
  Phone,
  Plus,
  Smartphone,
} from 'lucide-react';
// import { App } from '@/types/types';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Button } from '../ui/button';
import { redirect } from 'next/navigation';

export function DashboardAppSwitcher({
  apps,
  defaultVersion,
}: {
  apps: any[]; // TODO: type this
  defaultVersion: any;
}) {
  const [selectedVersion, setSelectedVersion] = React.useState(defaultVersion);

  return (
    <SidebarMenu>
      <SidebarGroupLabel>Select or create an app</SidebarGroupLabel>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size='lg'
              className='data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground'
            >
              <div className='flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground'>
                <Smartphone />
              </div>
              <div className='flex flex-col leading-none font-light w-full'>
                <div className={'text-sm leading-[1.1]'}>Current</div>
                <div className={'font-extrabold leading-[1.1]'}>
                  {selectedVersion.name}
                </div>
              </div>
              <ChevronsUpDown className='ml-auto' />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className='w-[--radix-dropdown-menu-trigger-width]'
            align='start'
          >
            {apps.map((app) => (
              <DropdownMenuItem
                key={app.name}
                onSelect={() => setSelectedVersion(app)}
              >
                {app.name}
                {app.name === selectedVersion.name && (
                  <Check className='ml-auto' />
                )}
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem className={'gap-2'} onClick={()=>redirect('/create')}>
                <Plus /> Create an app
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
