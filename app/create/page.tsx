import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AppSelectOrCreate from '@/components/create/AppSelectOrCreate';
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
    <div className={'flex flex-col gap-8 max-w-6xl w-full'}>
      <div className={'flex flex-row justify-between'}>
        <div className={'text-3xl font-mono'}>Build an app</div>
        <AppSelectOrCreate user={user} />
      </div>
      <CreateForms user={user}/>
    </div>
  );
};

export default CreatePage;
