'use client';

import * as React from 'react';
import { DollarSign, Handshake, Users } from 'lucide-react';
import { CreateSidebarSteps } from '@/components/create/create-sidebar-steps';
import { CreateSidebarAccountOptions } from '@/components/create/create-sidebar-account-options';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { fakeApps } from '@/data/fakeData';

import CreateAppSwitcher from './create-app-switcher';

const data = {
  versions: ['1.0.1', '1.1.0-alpha', '2.0.0-beta1'],
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Users',
      urlSegment: 'users',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'Quick View',
          url: '/dashboard/users',
        },
        {
          title: 'Permissions',
          url: '/dashboard/users/permissions',
        },
        {
          title: 'Settings',
          url: '/dashboard/users/settings',
        },
      ],
    },
  ],
  options: [
    {
      name: 'Billing',
      url: '/dashboard/billing',
      icon: DollarSign,
    },
    {
      name: 'Team',
      url: '/dashboard/team',
      icon: Handshake,
    },
  ],
};

export function CreateSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar> & { [key: string]: any }) {
  return (
    <Sidebar
      collapsible='none'
      {...props}
      className={'h-full flex flex-col border-2'}
    >
      <SidebarHeader>
        <SidebarGroupLabel>Select or create</SidebarGroupLabel>
        <CreateAppSwitcher user={props.user} />
      </SidebarHeader>
      <SidebarContent className={'h-full border flex flex-col grow'}>
        <CreateSidebarSteps />
        <SidebarSeparator />
        <CreateSidebarAccountOptions options={data.options} />
      </SidebarContent>
      <SidebarFooter></SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
