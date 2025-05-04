'use client';

import React from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { usePathname } from 'next/navigation';
import { useDashboardConfigStore } from '@/providers/dashboard-config-provider';

const DashboardBreadcrumb: React.FC = ({}) => {
  const pathSegments = usePathname().split('/').slice(2) // removes '' and 'dashboard';
  const { selectedApp } = useDashboardConfigStore((state) => state);

  // TODO: write bread crumb logic to show you're at Home when there's no
  // additional path segment

  console.log('p', pathSegments)
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className='hidden md:block'>
          <BreadcrumbLink href='#'>
            {selectedApp?.name} {pathSegments}
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='hidden md:block' />
        {pathSegments.length === 0 ? 'Home' : pathSegments.map((segment: string, index: number) => {
          return (
            <BreadcrumbItem key={`${index}`}>
              <BreadcrumbPage>{segment}</BreadcrumbPage>
            </BreadcrumbItem>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
