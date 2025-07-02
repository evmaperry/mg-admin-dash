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
import { SidebarGroupLabel } from '../ui/sidebar';
import { Plus, Sparkles } from 'lucide-react';

const CreateAppSwitcher: React.FC<{ user: User }> = ({ user }) => {
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
    mapLabels,
  } = useCreateAppStore((state) => state);

  const [userAppDrafts, setUserAppDrafts] = useState<any[]>();

  const getAndSetUserDraftApps = async () => {
    try {
      const userApps: any = await getUserAppsFromDb(user.id);

      userApps.sort((a: App, b: App) => {
        if (a.id < b.id) {
          return -1;
        } else if (a.id > b.id) {
          return 1;
        }
      });
      setUserAppDrafts(userApps);

      // select first app
      const firstAppId: number = userApps[0].id;
      setAppId(firstAppId);
      const app = await getAppInfoFromDb(firstAppId);
      console.log('ApP', app);
      setApp(app);
    } catch (e) {
      console.error('APP SELECT ERROR: failed to getAndSetUserApps', e);
    }
  };

  useEffect(() => {
    // gets all of users apps
   getAndSetUserDraftApps();
  }, [user]);

  const handleAppSelection = async (appId: number) => {
    const app = await getAppInfoFromDb(appId);
    setAppId(appId);
    setApp(app);
  };

  // const handleSave = async () => {
  //   const updatedApp = await updateAppInDb(appId as number, {
  //     eventName: appDetails['Event name'] as string,
  //     appName: appDetails['App name'] as string,
  //     eventLatitude: appDetails['Event latitude'] as number,
  //     eventLongitude: appDetails['Event longitude'] as number,
  //     startDateTime: appDetails['Start date'] + 'T' + appDetails['Start time'],
  //     endDateTime: appDetails['End date'] + 'T' + appDetails['End time'],
  //     appColors,
  //     mapLabels
  //   });

  //   setCanSave(false);
  // };

  return (
    <div className={'flex flex-col gap-4'}>
      <Select
        value={String(appId)}
        onValueChange={(value) => {
          handleAppSelection(Number(value));
        }}
      >
        <SelectTrigger className={''}>
          {!appId
            ? 'Select an existing app'
            : userAppDrafts?.find((app) => app.id === appId).appName}
        </SelectTrigger>
        <SelectContent>
          {userAppDrafts &&
            userAppDrafts.length > 0 &&
            userAppDrafts.map((userApp: any, index: number) => {
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
      <Button className={'bg-sky-400 gap-2'}>
        <Sparkles />
        Start a new draft
      </Button>
    </div>
  );
};

export default CreateAppSwitcher;
