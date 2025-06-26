import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AppSelectOrCreate from '@/components/create/AppOptionsMenu';
import { redirect } from 'next/navigation';
import CreateForms from '@/components/create/CreateForms';

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
      <div className={'flex flex-row justify-center bg-neutral-900 pb-5 pt-8'}>
        <div className={'max-w-5xl w-full flex justify-between px-6'}>
          <div className={'text-3xl font-mono text-neutral-50'}>
            Build an app
          </div>
          <AppSelectOrCreate user={user} />
        </div>
      </div>
      <div
        className={
          'flex flex-col h-[calc(100vh-280px)] overflow-scroll pt-12 px-12'
        }
      >
        <CreateForms user={user} />
      </div>
    </div>
  );
};

export default CreatePage;
