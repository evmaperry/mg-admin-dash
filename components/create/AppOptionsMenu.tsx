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
import { App } from 'mgtypes/types/App';

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
    appColors,
  } = useCreateAppStore((state) => state);

  const [userApps, setUserApps] = useState<any[]>();

  const getAndSetUserApps = async () => {
    try {
      const userApps: any = await getUserAppsFromDb(user.id);

      userApps.sort((a: App, b: App) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
      });
      setUserApps(userApps);

      // select first app
      const firstAppId:number = userApps[0].id
      setAppId(firstAppId);
      const app = await getAppInfoFromDb(firstAppId);
      console.log('ApP', app)
      setApp(app)
    } catch (e) {
      console.error('APP SELECT ERROR: failed to getAndSetUserApps', e);
    }
  };

  useEffect(() => {
    // gets all of users apps
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
      eventLatitude: appDetails['Event latitude'] as number,
      eventLongitude: appDetails['Event longitude'] as number,
      startDateTime: appDetails['Start date'] + 'T' + appDetails['Start time'],
      endDateTime: appDetails['End date'] + 'T' + appDetails['End time'],
      appColors,
    });

    setCanSave(false);
  };

  return (
    <div className={'flex flex-row items-center gap-4'}>
      <Select
        value={String(appId)}
        onValueChange={(value) => {
          handleAppSelection(Number(value));
        }}
      >
        <SelectTrigger className={'w-48 ml-8'}>
          {!appId
            ? 'Select an existing app'
            : userApps?.find((app) => app.id === appId).appName}
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
      <Button onClick={handleSave} disabled={!canSave}>
        Save draft
      </Button>
      <Button className={'bg-sky-600'}>Start a new app</Button>
    </div>
  );
};

export default AppSelectOrCreate;
