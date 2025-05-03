'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Crosshair,
  DollarSign,
  Frame,
  GalleryVerticalEnd,
  Image,
  Map,
  Megaphone,
  Pencil,
  PieChart,
  Settings2,
  SquareTerminal,
  StickyNote,
  Users,
} from 'lucide-react';
import { AppSwitcher } from './app-switcher';
import { NavAppOptions } from '@/components/dashboard/nav-app-options';
import { NavAccountOptions } from '@/components/dashboard/nav-account-options';
import { NavUser } from '@/components/dashboard/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarSeparator,
} from '@/components/ui/sidebar';
import { fakeApps } from '@/data/fakeData';

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
      url: '#',
      icon: Users,
      isActive: true,
      items: [
        {
          title: 'Quick View',
          url: '#',
        },
        {
          title: 'Permissions',
          url: '#',
        },
        {
          title: 'Settings',
          url: '#',
        },
      ],
    },
    {
      title: 'Content',
      url: '#',
      icon: Image,
      items: [
        {
          title: 'Quick View',
          url: '#',
        },
        {
          title: 'Create',
          url: '#',
        },
      ],
    },
    {
      title: 'Map',
      url: '#',
      icon: Map,
      items: [
        {
          title: 'Quick View',
          url: '#',
        },
      ],
    },
    {
      title: 'Ads',
      url: '#',
      icon: Megaphone,
      items: [
        {
          title: 'Quick View',
          url: '#',
        },
      ],
    },
    {
      title: 'Settings',
      url: '#',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '#',
        },
        {
          title: 'Team',
          url: '#',
        },
        {
          title: 'Billing',
          url: '#',
        },
        {
          title: 'Limits',
          url: '#',
        },
      ],
    },
  ],
  options: [
    {
      name: 'Billing',
      url: '#',
      icon: DollarSign,
    },
  ],
};

export function DashboardSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible='none' {...props}>
      <SidebarHeader>
        <AppSwitcher
          apps={fakeApps}
          defaultVersion={fakeApps[0]}
        />
      </SidebarHeader>
      <SidebarContent>
        <NavAppOptions items={data.navMain} />
        <SidebarSeparator />
        <NavAccountOptions options={data.options} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
