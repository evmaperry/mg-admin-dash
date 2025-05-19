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
import {
  getAppInfoFromDb,
  getUserAppsFromDb,
  updateAppInDb,
} from '@/components/create/createActions';
import { User } from '@supabase/supabase-js';
import { Button } from '../ui/button';
import { useCreateAppStore } from '@/providers/create-app-provider';

const AppSelectOrCreate: React.FC<{ user: User }> = ({ user }) => {
  // THE ACTIVE APP WE'RE WORKING ON
  // STARTS AS NULL
  const {
    appId,
    setApp,
    setAppId,
    appDetails,
    canSave,
    setCanSave,
    centerMapViewState,
    appColors
  } = useCreateAppStore((state) => state);

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
    const app = await getAppInfoFromDb(appId);
    setAppId(appId);
    setApp(app);
  };

  const handleSave = async () => {
    const updatedApp = await updateAppInDb(appId as number, {
      eventName: appDetails['Event name'] as string,
      appName: appDetails['App name'] as string,
      eventLatitude: centerMapViewState?.latitude as number,
      eventLongitude: centerMapViewState?.longitude as number,
      startDateTime: appDetails['Start date'] + 'T' + appDetails['Start time'],
      endDateTime: appDetails['End date'] + 'T' + appDetails['End time'],
      appColors,
    });

    setCanSave(false);
  };

  return (
    <div className={'flex flex-row items-center gap-4'}>
      <Select
        onValueChange={(value) => {
          handleAppSelection(Number(value));
        }}
      >
        <SelectTrigger className={'w-48 ml-8'}>
          {!appDetails['App name']
            ? 'Select an existing app'
            : appDetails['App name']}
        </SelectTrigger>
        <SelectContent>
          {userApps &&
            userApps.length > 0 &&
            userApps.map((userApp: any, index: number) => {
              return (
                <SelectItem
                  value={String(userApp.id)}
                  key={`user-app-${index}`}
                >
                  <Button variant={'ghost'}>{userApp.appName}</Button>
                </SelectItem>
              );
            })}
        </SelectContent>
      </Select>
      <Button onClick={handleSave} disabled={!canSave}>Save</Button>
      <Button className={'bg-sky-600'} >
        Start a new app
      </Button>
    </div>
  );
};

export default AppSelectOrCreate;
