import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { DashboardSidebar } from '@/components/dashboard/dashboard-sidebar';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import DashboardBreadcrumb from '@/components/dashboard/dashboard-breadcrumb';



export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  console.log('user', user);

  return (
    <div className='flex-1 w-full flex flex-col gap-12'>
      <div>
        <SidebarProvider>
          <DashboardSidebar />
          <SidebarInset>
            <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
              <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mr-2 h-4' />
                 <DashboardBreadcrumb/>
              </div>
            </header>
            <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
              <div className='grid auto-rows-min gap-4 md:grid-cols-3'>
                <div className='aspect-video rounded-xl bg-muted/50' />
                <div className='aspect-video rounded-xl bg-muted/50' />
                <div className='aspect-video rounded-xl bg-muted/50' />
              </div>
              <div className='min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min' />
            </div>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  );
}
