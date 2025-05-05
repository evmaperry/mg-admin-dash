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
import { capitalize } from 'lodash';

const DashboardBreadcrumb: React.FC = ({}) => {
  const pathSegments = usePathname().split('/').slice(2); // removes '' and 'dashboard';
  const { selectedApp } = useDashboardConfigStore((state) => state);

  // TODO: write bread crumb logic to show you're at Home when there's no
  // additional path segment

  console.log('p', pathSegments);
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem className='hidden md:block'>
          <BreadcrumbLink href='#'>{selectedApp?.name}</BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator className='hidden md:block' />
        {pathSegments.length === 0
          ? 'Home'
          : pathSegments.map(
              (segment: string, index: number, array: string[]) => {
                return (
                  <React.Fragment key={`${index}`}>
                    <BreadcrumbItem>
                      <BreadcrumbPage>{capitalize(segment)}</BreadcrumbPage>
                    </BreadcrumbItem>
                    {index < array.length - 1 && (
                      <BreadcrumbSeparator className='hidden md:block' />
                    )}
                  </React.Fragment>
                );
              }
            )}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default DashboardBreadcrumb;
