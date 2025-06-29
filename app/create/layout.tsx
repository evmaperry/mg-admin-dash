import { createClient } from '@/utils/supabase/server';
import { InfoIcon } from 'lucide-react';
import { redirect } from 'next/navigation';
import { CreateSidebar } from '@/components/create/create-sidebar';
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

export default async function CreateLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className='flex-1 w-full flex flex-col gap-12'>
        <SidebarProvider>
          <CreateSidebar user={user}/>
          <SidebarInset>
            {/* <header className='flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12'>
              <div className='flex items-center gap-2 px-4'>
                <SidebarTrigger className='-ml-1' />
                <Separator orientation='vertical' className='mr-2 h-4' />
                <div
                  className={
                    'flex flex-row justify-center bg-neutral-900 h-full py-2'
                  }
                >
                  <div className={'max-w-5xl w-full flex justify-between px-6'}>
                    <div className={'text-3xl font-mono text-neutral-50'}>
                      Build an app
                    </div>
                  </div>
                </div>
              </div>
            </header> */}
            <div className='flex flex-1 flex-col gap-4 p-4 pt-0'>
              {children}
            </div>
          </SidebarInset>
        </SidebarProvider>
    </div>
  );
}
