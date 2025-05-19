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
    <div className={'flex flex-col max-w-6xl w-full'}>
      <div className={'flex flex-row justify-between bg-neutral-200 pl-12 pr-8 pb-5 pt-10'}>
        <div className={'text-3xl font-mono'}>Build an app</div>
        <AppSelectOrCreate user={user} />
      </div>
      <div className={'flex flex-col h-[calc(100vh-280px)] overflow-scroll pt-4'}>
        <CreateForms user={user}/>
      </div>

    </div>
  );
};

export default CreatePage;
