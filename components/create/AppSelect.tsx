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
import { getUserAppsFromDb } from '@/components/create/createActions';
import { User } from '@supabase/supabase-js';
import { Button } from '../ui/button';

const AppSelect: React.FC<{ user: User }> = ({ user }) => {
  const [userApps, setUserApps] = useState<any[]>();

  const getAndSetUserApps = async () => {
    try {
      const userApps: any = await getUserAppsFromDb(user.id);
      console.log('user apps', userApps);
      setUserApps(userApps);
    } catch (e) {
      console.error('APP SELECT ERROR: failed to getAndSetUserApps', e);
    }
  };

  useEffect(() => {
    getAndSetUserApps();
  }, [user]);

  return (
    <Select>
      <SelectTrigger className={'w-48 ml-8'}>Select your app</SelectTrigger>
      <SelectContent>
        {userApps &&
          userApps.length > 0 &&
          userApps.map((app: any, index: number) => {
            return (
              <SelectItem value={app.id} key={`user-app-${index}`}>
                <Button variant={'ghost'}>{app.appName}</Button>
              </SelectItem>
            );
          })}
        <SelectItem
          value={'create'}
          onClick={() => console.log('Creating new')}
        >
          <Button variant={'ghost'}>Create new</Button>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};

export default AppSelect;
