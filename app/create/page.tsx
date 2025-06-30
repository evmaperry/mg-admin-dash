import React from 'react';
import { createClient } from '@/utils/supabase/server';
import AppSelectOrCreate from '@/components/create/create-app-switcher';
import { redirect } from 'next/navigation';
import CreateDashboard from '@/components/create/CreateDashboard';
import { Button } from '@/components/ui/button';

// KEEP THIS COMPONENT TO RUN AUTH ON SERVER BEFORE LOADING CreateDashboard, WHICH IS A CLIENT COMPONENT
const CreatePage: React.FC<{}> = async ({}) => {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div
      className={'flex flex-col'}
    >
      <CreateDashboard user={user} />
    </div>
  );
};

export default CreatePage;
