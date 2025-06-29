import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AppSelectOrCreate from '@/components/create/create-app-switcher';
import { redirect } from 'next/navigation';
import CreateDashboard from '@/components/create/CreateDashboard';
import { Button } from '@/components/ui/button';

const CreatePage: React.FC<{}> = async ({}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className={'flex flex-col w-full'}>
      <div
        className={
          'flex flex-col h-[calc(100vh-280px)] overflow-scroll pt-6 px-12'
        }
      >
        <CreateDashboard user={user} />
      </div>
    </div>
  );
};

export default CreatePage;
