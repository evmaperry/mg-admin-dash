'use client';
import React, { useEffect, useState } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import TimePicker from '../time-picker';
import {
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
} from './createActions';
import DatePicker from '../date-picker';

// APP NAME, EVENT NAME, START & END DATETIMES
const AppDetailInputs: React.FC<{}> = () => {
  const { setAppDetails, appDetails, setCanSave, appId } = useCreateAppStore(
    (state) => state
  );

  // local state used to set coordinates in store's app details
  const [location, setLocation] = useState<string>('');

  const getAndSetCoordinates = async () => {
    const coordinates = await getCoordinatesFromAddress(location);
    setAppDetails({
      'Event latitude': coordinates[0],
      'Event longitude': coordinates[1],
    });
  };

  const getAndSetLocation = async () => {
    const location = await getAddressFromCoordinates(
      appDetails['Event latitude'] as number,
      appDetails['Event longitude'] as number
    );
    setLocation(location);
  };

  useEffect(() => {
    if (appDetails['Event latitude'] && appDetails['Event longitude']) {
      getAndSetLocation();
    }
  }, [appDetails['Event latitude'], appDetails['Event longitude']]);

  return (
    <div className={'flex flex-col gap-4'}>
      <div className={'flex flex-col gap-2 bg-neutral-50 border rounded p-4 shadow'}>
        <Label className={'font-mono'}>Event address</Label>
        <div
          className={'flex flex-row items-center w-full gap-6 justify-between'}
        >
          <Input
            className={'w-full'}
            value={location}
            placeholder='e.g., Springfield, Illinois, the Washington Mall, or Central Park'
            onChange={(e) => {
              setLocation(e.target.value);
              setCanSave(true);
            }}
          />
          <Button className={'bg-indigo-600'} onClick={getAndSetCoordinates}>
            Save location
          </Button>
        </div>
      </div>

      <div className={'flex flex-col gap-2 bg-neutral-50 border rounded p-4 shadow'}>
        <Label className={'font-mono'}>Important names</Label>
        <div
          className={'flex flex-row w-full gap-8 items-center justify-between'}
        >
          <div className={'flex flex-row items-center gap-1 w-1/2'}>
            <Label className={'flex flex-row w-1/3 justify-center'}>Event name</Label>
            <Input
              className={''}
              placeholder={
                'e.g., Springfield BBQ Festival, Washington Mall Walk, or Central Park Art Fair'
              }
              value={appDetails['Event name'] ? appDetails['Event name'] : ''}
              onChange={(e) => {
                setAppDetails({ 'Event name': e.target.value });
                setCanSave(true);
              }}
            />
          </div>

          <div className={'flex flex-row items-center gap-1 w-1/2'}>
            <Label className={'flex flex-row w-1/3 justify-center'}>App name</Label>
            <Input
              className={''}
              placeholder={
                'e.g., SpringfieldBBQ!, MallWalk Connect, or ParkArts+'
              }
              value={appDetails['App name'] ? appDetails['App name'] : ''}
              onChange={(e) => {
                setAppDetails({ 'App name': e.target.value });
                setCanSave(true);
              }}
            />
          </div>
        </div>
      </div>

      <div className={'flex flex-col gap-2 bg-neutral-50 border rounded p-4 shadow'}>
        <Label className={'font-mono'}>Event dates & times</Label>
        <div className={'flex flex-row items-center w-full'}>

          <div className={'flex flex-row items-center gap-2 w-1/2'}>
            <Label>Start</Label>
            <DatePicker
              hint={'Date'}
              onSelect={(value) => {
                setAppDetails({ 'Start date': String(value) });
                setCanSave(true);
              }}
              selectedDateString={appDetails['Start date']}
              triggerClassName='w-1/2'
            />
            <TimePicker
              onSelectTime={(time: string) => {
                setAppDetails({ 'Start time': time });
                setCanSave(true);
              }}
              timeToDisplay={appDetails['Start time'] ?? undefined}
              triggerClassName={'w-3/12'}
              hint={'Time'}
            />
          </div>

          <div className={'flex flex-row justify-end gap-2 items-center w-1/2'}>

            <Label>End</Label>
            <DatePicker
              hint={'Date'}
              onSelect={(value) => {
                setAppDetails({ 'End date': String(value) });
                setCanSave(true);
              }}
              selectedDateString={appDetails['End date']}
              triggerClassName='w-1/2'
            />

            <TimePicker
              onSelectTime={(time: string) => {
                setAppDetails({ 'End time': time });
                setCanSave(true);
              }}
              timeToDisplay={appDetails['End time'] ?? undefined}
              hint={'Time'}
              triggerClassName={'w-3/12'}
            />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AppDetailInputs;
