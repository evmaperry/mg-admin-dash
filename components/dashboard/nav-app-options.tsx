'use client';

import { ChevronRight, Home, type LucideIcon } from 'lucide-react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar';
import { redirect, usePathname } from 'next/navigation';
import { useDashboardConfigStore } from '@/providers/dashboard-config-provider';
import { cn } from '@/lib/utils';

export function NavAppOptions({
  items,
}: {
  items: {
    title: string;
    urlSegment: string;
    icon?: LucideIcon;
    isActive?: boolean;
    items?: {
      title: string;
      url: string;
    }[];
  }[];
}) {
  const path = usePathname();
  const pathSegments = path.split('/').slice(2); // removes '' and 'dashboard';
  const { selectedApp } = useDashboardConfigStore((state) => state);

  console.log('path', path, 'pSegs', pathSegments);
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Manage</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => {
              redirect('/dashboard');
            }}
            tooltip={'Home'}
            className={cn(pathSegments.length === 0 && 'bg-sidebar-accent')}
          >
            <Home />
            <span>Home</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        {items.map((item) => {
          return (
            <Collapsible
              key={item.title}
              asChild
              defaultOpen={pathSegments[0]===item.urlSegment}
              className='group/collapsible'
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title} className={''}>
                    {item.icon && <item.icon />}
                    <span>{item.title}</span>
                    <ChevronRight className='ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90' />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    { item.items?.map((subItem) => {
                      return (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a
                            href={subItem.url}
                            className={cn(
                              subItem.url === path && 'bg-sidebar-accent'
                            )}
                          >
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    )})}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
