'use client';
import React, { useEffect, useState } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../../ui/button';
import { Calendar } from '../../ui/calendar';
import { CalendarIcon, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import TimePicker from '../../time-picker';
import {
  getAddressFromCoordinates,
  getCoordinatesFromAddress,
} from '../createActions';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePicker from '../../date-picker';

// APP NAME, EVENT NAME, START & END DATETIMES
const Basics: React.FC<{}> = () => {
  const states = [
    'Alabama',
    'Alaska',
    'Arizona',
    'Arkansas',
    'California',
    'Colorado',
    'Connecticut',
    'Delaware',
    'Florida',
    'Georgia',
    'Hawaii',
    'Idaho',
    'Illinois',
    'Indiana',
    'Iowa',
    'Kansas',
    'Kentucky',
    'Louisiana',
    'Maine',
    'Maryland',
    'Massachusetts',
    'Michigan',
    'Minnesota',
    'Mississippi',
    'Missouri',
    'Montana',
    'Nebraska',
    'Nevada',
    'New Hampshire',
    'New Jersey',
    'New Mexico',
    'New York',
    'North Carolina',
    'North Dakota',
    'Ohio',
    'Oklahoma',
    'Oregon',
    'Pennsylvania',
    'Rhode Island',
    'South Carolina',
    'South Dakota',
    'Tennessee',
    'Texas',
    'Utah',
    'Vermont',
    'Virginia',
    'Washington',
    'West Virginia',
    'Wisconsin',
    'Wyoming',
  ];

  const { setAppDetails, appDetails, setCanSave, appId } = useCreateAppStore(
    (state) => state
  );

  // local state used to set coordinates in store's app details
  const [location, setLocation] = useState<{
    city: string;
    state: string;
    zip: string;
  }>({ city: '', state: '', zip: '' });

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
    <div
      className={'create-app-form-container'}
    >
      <div className={'flex items-center gap-4'}>
        <div className={'create-app-form-title'}>The basics</div>
        {/*  INSTRUCTIONS */}
        <Popover>
          <PopoverTrigger asChild>
            <Button size={'sm'} variant={'outline'}>
              <Info className={'mr-1'} /> Instructions
            </Button>
          </PopoverTrigger>
          <PopoverContent className={'leading-[1.2] font-light w-[600px]'}>
            <div>Basics go here</div>
          </PopoverContent>
        </Popover>
      </div>
      <div className={'flex flex-col gap-4'}>
        <div
          className={
            'create-app-form-subcontainer'
          }
        >
          <Label className={'create-app-form-subtitle'}>Event location</Label>
          <div
            className={
              'flex flex-row items-center justify-between w-full gap-x-4 gap-y-2 flex-wrap'
            }
          >
            <div className={'flex flex-col grow gap-2'}>
              <Label className={''}>City</Label>
              <Input
                className={'min-w-48 max-w-full'}
                value={location.city}
                placeholder='ex. Albany'
                onChange={(e) => {
                  setLocation({ ...location, city: e.target.value });
                  setCanSave(true);
                }}
              />
            </div>

            <div className={'flex flex-col grow gap-2'}>
              <Label className={''}>State</Label>
              <Select
                onValueChange={(state: string) => {
                  setLocation({ ...location, state });
                }}
                value={location.state}
              >
                <SelectTrigger
                  value={location.state}
                  className={'min-w-40 max-w-full'}
                >
                  <SelectValue placeholder={'ex. New York'} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {states.map((state, index) => {
                      return (
                        <SelectItem value={state} key={`state-${index}`}>
                          {state}
                        </SelectItem>
                      );
                    })}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <div className={'flex flex-col gap-2'}>
              <Label className={''}>Zip</Label>
              <Input
                className={'min-w-24 max-w-32 text-center'}
                value={location.zip}
                placeholder='34566'
                onChange={(e) => {
                  setLocation({ ...location, zip: e.target.value });
                  setCanSave(true);
                }}
              />
            </div>
          </div>
        </div>

        <div
          className={
            'flex flex-col gap-4 bg-neutral-50 border rounded p-4 shadow'
          }
        >
          <Label className={'create-app-form-subtitle'}>Important names</Label>
          <div
            className={
              'flex flex-row flex-wrap w-full gap-x-8 gap-y-2 items-center justify-around'
            }
          >
            <div className={'flex flex-col grow gap-2'}>
              <Label className={'text-left'}>Event name</Label>
              <Input
                className={'min-w-48 max-w-full'}
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

            <div className={'flex flex-col grow gap-2'}>
              <Label className={'flex flex-row'}>App name</Label>
              <Input
                className={'min-w-48 max-w-full'}
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

        <div
          className={
            'flex flex-col gap-4 bg-neutral-50 border rounded p-4 shadow'
          }
        >
          <Label className={'create-app-form-subtitle'}>
            Event dates & times
          </Label>

          <div className={'flex flex-row flex-wrap items-center w-full gap-4'}>
            <div className={'flex flex-col gap-2 grow'}>
              <Label className=''>Start</Label>
              <div className={'flex flex-row items-center grow gap-2'}>
                <DatePicker
                  hint={'Date'}
                  onSelect={(value) => {
                    setAppDetails({ 'Start date': String(value) });
                    setCanSave(true);
                  }}
                  selectedDateString={appDetails['Start date']}
                  triggerClassName={'w-1/2'}
                />
                <TimePicker
                  onSelectTime={(time: string) => {
                    setAppDetails({ 'Start time': time });
                    setCanSave(true);
                  }}
                  timeToDisplay={appDetails['Start time'] ?? undefined}
                  triggerClassName={'w-1/2'}
                  hint={'Time'}
                />
              </div>
            </div>

            <div className={'flex flex-col gap-2 grow'}>
              <Label className={''}>End</Label>
              <div className={'flex flex-row items-center grow gap-2'}>
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
                  triggerClassName={'w-1/2'}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basics;
