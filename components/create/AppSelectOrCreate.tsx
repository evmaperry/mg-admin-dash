'use client';
import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAppInfoFromDb, getUserAppsFromDb } from '@/components/create/createActions';
import { User } from '@supabase/supabase-js';
import { Button } from '../ui/button';
import { useCreateAppStore } from '@/providers/create-app-provider';

const AppSelectOrCreate: React.FC<{ user: User }> = ({ user }) => {
  // THE ACTIVE APP WE'RE WORKING ON
  // STARTS AS NULL
  const { setApp, setAppId, appDetails } = useCreateAppStore((state) => state);

  const [userApps, setUserApps] = useState<any[]>();

  const getAndSetUserApps = async () => {
    try {
      const userApps: any = await getUserAppsFromDb(user.id);
      setUserApps(userApps);
    } catch (e) {
      console.error('APP SELECT ERROR: failed to getAndSetUserApps', e);
    }
  };

  useEffect(() => {
    getAndSetUserApps();
  }, [user]);

  const handleAppSelection = async (appId: number) => {
    const app = await getAppInfoFromDb(appId)
    setAppId(appId);
    setApp(app);
  };

  return (
    <div className={'flex flex-row items-center gap-4'}>
      <Select
        onValueChange={(value) => {
          handleAppSelection(Number(value));
        }}
      >
        <SelectTrigger className={'w-48 ml-8'}>
          {appDetails['App name'] === null
            ? 'Select an existing app'
            : appDetails['App name']}
        </SelectTrigger>
        <SelectContent>
          {userApps &&
            userApps.length > 0 &&
            userApps.map((userApp: any, index: number) => {
              return (
                <SelectItem value={String(userApp.id)} key={`user-app-${index}`}>
                  <Button variant={'ghost'}>{userApp.appName}</Button>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
      <Button className={'bg-sky-600'}>Start a new app</Button>
    </div>
  );
};

export default AppSelectOrCreate;
