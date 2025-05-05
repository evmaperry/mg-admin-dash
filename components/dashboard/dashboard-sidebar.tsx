'use client';

import * as React from 'react';
import {
  AudioWaveform,
  BookOpen,
  Bot,
  ChartBar,
  ChartLine,
  Command,
  Crosshair,
  DollarSign,
  Frame,
  GalleryVerticalEnd,
  Handshake,
  HeartHandshake,
  Image,
  Map,
  Megaphone,
  Pencil,
  PieChart,
  Settings2,
  SquareTerminal,
  StickyNote,
  Users,
  Users2,
} from 'lucide-react';
import { AppSwitcher } from './app-switcher';
import { NavAppOptions } from '@/components/dashboard/nav-app-options';
import { NavAccountOptions } from '@/components/dashboard/nav-account-options';
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
    {
      title: 'Content',
      urlSegment: 'content',
      icon: Image,
      items: [
        {
          title: 'Quick View',
          url: '/dashboard/content',
        },
        {
          title: 'Create',
          url: '/dashboard/content/create',
        },
      ],
    },
    {
      title: 'Map',
      urlSegment: 'map',
      icon: Map,
      items: [
        {
          title: 'Quick View',
          url: '/dashboard/map',
        },
      ],
    },
    {
      title: 'Ads',
      urlSegment: 'ads',
      icon: Megaphone,
      items: [
        {
          title: 'Quick View',
          url: '/dashboard/ads',
        },
      ],
    },
    {
      title: 'Trends',
      urlSegment: 'trends',
      icon: ChartLine,
      items: [
        {
          title: 'Quick View',
          url: '/dashboard/trends',
        },
      ],
    },
    {
      title: 'Settings',
      urlSegment: 'settings',
      icon: Settings2,
      items: [
        {
          title: 'General',
          url: '/dashboard/settings',
        },
        {
          title: 'Theme',
          url: '/dashboard/settings/theme',
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
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
