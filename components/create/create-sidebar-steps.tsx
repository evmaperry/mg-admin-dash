'use client';

import {
  ChevronRight,
  Home,
  MapPin,
  Milestone,
  Palette,
  Pencil,
  type LucideIcon,
} from 'lucide-react';
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
import { useCreateAppStore } from '@/providers/create-app-provider';
import { cn } from '@/lib/utils';
import { capitalize, toUpper } from 'lodash';

export function CreateSidebarSteps() {
  const { setSelectedStep, selectedStep, stepCompletions } = useCreateAppStore(
    (state) => state
  );

  const steps = [
    { value: 'basics', icon: Pencil },
    { value: 'colors', icon: Palette },
    { value: 'markers', icon: MapPin },
    { value: 'signs', icon: Milestone },
  ];

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Steps</SidebarGroupLabel>
      <SidebarMenu>
        {steps.map((step, index) => {
          return (
            <SidebarMenuItem key={step.value}>
              <SidebarMenuButton
                tooltip={step.value}
                className={cn(selectedStep === step.value && 'bg-sidebar-accent')}
                onClick={() => {
                  setSelectedStep(
                    step.value as 'basics' | 'colors' | 'signs' | 'markers'
                  );
                }}
              >
                {step.icon && <step.icon />}
                <div className='w-full flex justify-between items-center'>
                  <span>{capitalize(step.value)}</span>
                  <span
                    className={cn(
                      'text-xs font-bold',
                      stepCompletions[
                        step.value as 'basics' | 'colors' | 'signs' | 'markers'
                      ] === 'complete'
                        ? 'text-emerald-500'
                        : 'text-red-500'
                    )}
                  >
                    {toUpper(
                      stepCompletions[
                        step.value as 'basics' | 'colors' | 'signs' | 'markers'
                      ]
                    )}
                  </span>
                </div>
              </SidebarMenuButton>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
