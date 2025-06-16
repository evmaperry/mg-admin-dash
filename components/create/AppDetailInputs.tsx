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
    setLocation(location)
  };

  useEffect(() => {
    if (appDetails['Event latitude'] && appDetails['Event longitude']) {
      getAndSetLocation();
    }
  }, [appDetails['Event latitude'], appDetails['Event longitude']]);

  return (
    <div className={'flex flex-col gap-2'}>
      <div className={'flex flex-col w-full gap-3'}>
        <Label>Location</Label>
        <div className={'flex flex-row items-center gap-6'}>
          <Input
            className={'w-1/2'}
            value={location}
            placeholder='e.g., Springfield, Illinois, the Washington Mall, or Central Park'
            onChange={(e) => {
              setLocation(e.target.value);
              setCanSave(true);
            }}
          />
          <Button className={'bg-sky-600'} onClick={getAndSetCoordinates}>
            Save location
          </Button>
        </div>
      </div>

      <div className={'flex flex-row gap-6'}>
        <div className={'flex flex-col w-1/2 gap-3'}>
          <div className={'flex flex-col gap-2'}>
            <Label>Event name</Label>
            <Input
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

          <div className={'flex flex-col gap-2'}>
            <Label>App name</Label>
            <div>
              <Input
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

        <div className={'flex flex-col grow gap-3'}>
          <div className={'flex flex-col gap-2'}>
            <Label>Start date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !appDetails['Start date'] && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={'mr-2'} />
                  {appDetails['Start date'] ? (
                    dayjs(appDetails['Start date']).format('ddd, MMM D')
                  ) : (
                    <span>Select a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    appDetails['Start date']
                      ? new Date(appDetails['Start date'])
                      : undefined
                  }
                  onSelect={(value) => {
                    setAppDetails({ 'Start date': String(value) });
                    setCanSave(true);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className={'flex flex-col gap-2'}>
            <Label>Start time</Label>
            <TimePicker
              onSelectTime={(time: string) => {
                setAppDetails({ 'Start time': time });
                setCanSave(true);
              }}
              timeToDisplay={appDetails['Start time'] ?? undefined}
            />
          </div>
        </div>

        <div className={'flex flex-col grow gap-3'}>
          <div className={'flex flex-col gap-2'}>
            <Label>End date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !appDetails['End date'] && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={'mr-2'} />
                  {appDetails['End date'] ? (
                    dayjs(appDetails['End date']).format('ddd, MMM D')
                  ) : (
                    <span>Select a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    appDetails['End date']
                      ? new Date(appDetails['End date'])
                      : undefined
                  }
                  onSelect={(value) => {
                    setAppDetails({ 'End date': String(value) });
                    setCanSave(true);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className={'flex flex-col gap-2'}>
            <Label>End time</Label>
            <TimePicker
              onSelectTime={(time: string) => {
                setAppDetails({ 'End time': time });
                setCanSave(true);
              }}
              timeToDisplay={appDetails['End time'] ?? undefined}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppDetailInputs;
