'use client'
import React from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { format } from 'date-fns';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
import { Calendar } from '../ui/calendar';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// APP NAME, EVENT NAME, START & END DATETIMES
const AppDetailInputs: React.FC<{}> = ({}) => {
  const { setAppDetails, appDetails } = useCreateAppStore((state) => state);

  return (
    <div className={'flex flex-row gap-6'}>
      <div className={'flex flex-col w-1/2 gap-2'}>
        <div className={'flex flex-col gap-2'}>
          <Label>Event name</Label>
          <Input
            placeholder={
              'e.g., Springfield BBQ Festival, National Fruit Festival, or 5th Ave Art Fair'
            }
            value={appDetails['Event name'] ? appDetails['Event name'] : ''}
            onChange={(e) => {
              setAppDetails({ 'Event name': e.target.value });
            }}
          />
        </div>

        <div className={'flex flex-col gap-2'}>
          <Label>App name</Label>
          <Input
            placeholder={'e.g., SpringfieldEats, FruitFest+, or 8thStreetArt'}
            value={appDetails['App name'] ? appDetails['App name'] : ''}
            onChange={(e) => {
              setAppDetails({ 'App name': e.target.value });
            }}
          />
        </div>
      </div>

      <div className={'flex flex-col grow gap-3'}>
        <div className={'flex flex-col gap-2'}>
          <Label>Select a start date</Label>
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
                  format(appDetails['Start date'], 'PPP')
                ) : (
                  <span>Click here</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={appDetails['Start date']}
                onSelect={(value) => setAppDetails({ 'Start date': value })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className={'flex flex-col gap-2'}>
          <Label>
            Start time <span className={'font-light'}>24-hour clock</span>
          </Label>
          <Input
            placeholder='eg, 07:00 or 15:50'
            onChange={(e) => setAppDetails({ 'Start time': e.target.value })}
          />
        </div>
      </div>

      <div className={'flex flex-col grow gap-3'}>
        <div className={'flex flex-col gap-2'}>
          <Label>Select an end date</Label>
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
                  format(appDetails['End date'], 'PPP')
                ) : (
                  <span>Click here</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className='w-auto p-0' align='start'>
              <Calendar
                mode='single'
                selected={appDetails['End date']}
                onSelect={(value) => setAppDetails({ 'End date': value })}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
        <div className={'flex flex-col gap-2'}>
          <Label>
            End time <span className={'font-light'}>24-hour clock</span>
          </Label>
          <Input
            placeholder='Ending time (24-hour)'
            onChange={(e) => setAppDetails({ 'End time': e.target.value })}
          />
        </div>
      </div>
    </div>
  );
};

export default AppDetailInputs;
