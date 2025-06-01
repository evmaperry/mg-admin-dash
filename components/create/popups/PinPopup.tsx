'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { CreateAppMarkers } from 'mgmarkers/markerConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import capitalize from 'lodash/capitalize';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';
import { createPost, getAddressFromCoordinates } from '../createActions';
import { MapMouseEvent } from 'mapbox-gl';
import { Pin, Post } from 'mgtypes/types/Content';
import dayjs from 'dayjs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import TimePicker from '@/components/time-picker';
import { addPinHoursToDb } from '@/actions';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Separator } from '@/components/ui/separator';
dayjs.extend(customParseFormat);
export interface PinHourInputs {
  startDate: string | undefined;
  startTime: string | undefined;
  endDate: string | undefined;
  endTime: string | undefined;
}

const PinPopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setMarkerIcon: (icon: React.ReactElement) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, setMarkerIcon, getAndSetMapMarkers }) => {
  const { appDetails, setCanSave, appId } = useCreateAppStore((state) => state);

  const [pin, setPin] = useState<Partial<Pin>>({
    longitude: null,
    latitude: null,
    address: '',
    phoneNumber: '',
    link: '',
    primaryText: '',
    secondaryText: '',
    pinCategory: '',
    pinType: '',
  });

  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('lce', lastClickEvent);

  const handleMapClick = async () => {
    const address = await getAddressFromCoordinates(
      lastClickEvent?.lngLat.lat as number,
      lastClickEvent?.lngLat.lng as number
    );
    setPin({
      ...pin,
      longitude: lastClickEvent?.lngLat.lng ?? 0,
      latitude: lastClickEvent?.lngLat.lat ?? 0,
      address,
    });
  };

  useEffect(() => {
    handleMapClick();
  }, [lastClickEvent]);

  const PinSelector: React.FC<{}> = ({}) => {
    const dropdownMenuGroup = Object.entries(CreateAppMarkers.pin).reduce(
      (acc: any[], cur: [string, string[]], index: number, array: any) => {
        acc.push(
          <DropdownMenuSub key={`dropdown-pin-category-${index}`}>
            <DropdownMenuSubTrigger>
              {capitalize(cur[0])}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {cur[1].map((pinType: string, index2: number) => {
                  return (
                    <DropdownMenuItem
                      key={`dropdown-pin-type-${index}-${index2}`}
                      className={'flex flex-row items-center gap-2'}
                      onClick={() => {
                        setPin({ ...pin, pinCategory: cur[0], pinType });
                        setMarkerIcon(
                          <Image
                            src={`/assets/images/pin-${cur[0]}-${pinType}.png`}
                            height={36}
                            width={36}
                            alt={'Pin image'}
                            className={
                              'border border-neutral-500 rounded-full p-[2px] bg-background'
                            }
                          />
                        );
                      }}
                    >
                      <Image
                        src={`/assets/images/pin-${cur[0]}-${pinType}.png`}
                        height={24}
                        width={24}
                        alt={'alt'}
                      />
                      <div>{capitalize(pinType.replaceAll('_', ' '))}</div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
        return acc;
      },
      []
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'default'}>
            {pin.pinType && pin.pinCategory ? (
              <div className={'flex flex-row items-center gap-2'}>
                <Image
                  src={`/assets/images/pin-${pin.pinCategory}-${pin.pinType}.png`}
                  height={24}
                  width={24}
                  alt={'alt'}
                />
                <div>{capitalize(pin.pinType)}</div>
              </div>
            ) : (
              <div>
                <span className={'font-bold text-sky-400'}>Step 2 </span>Select
                a Pin Type
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent>
          <DropdownMenuGroup className={'flex flex-col'}>
            {dropdownMenuGroup}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageFile(file);
    setImage(file ? URL.createObjectURL(file) : undefined);
  };

  const handleTextInput = (e: any) => {
    const { name, value } = e.target;
    setPin({ ...pin, [name]: value });
  };

  const [pinHours, setPinHours] = useState<PinHourInputs[]>([]);

  const [pinHour, setPinHour] = useState<PinHourInputs>({
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
  });

  const handleAddPinHour = () => {
    // TODO: add form validation
    setPinHours([...pinHours, pinHour]);
    setPinHour({
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
    });
    setImage(undefined);
    setImageFile(undefined);
  };

  const PinHours: React.FC<{}> = ({}) => {
    return (
      <div className={'flex flex-col items-center w-full gap-4'}>
        <div
          className={'flex flex-row items-center gap-4 w-full justify-around'}
        >
          <div className={'flex flex-col gap-1'}>
            <div
              className={
                'flex flex-row items-center w-full justify-start gap-6'
              }
            >
              <div className={'w-12 create-event-form-label'}>Opens</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[160px] justify-start text-left font-normal',
                      !pinHour['startDate'] && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className={'mr-2'} />
                    {pinHour['startDate'] ? (
                      dayjs(pinHour['startDate']).format('ddd, MMM D')
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      pinHour['startDate']
                        ? new Date(pinHour['startDate'])
                        : undefined
                    }
                    onSelect={(value) => {
                      setPinHour({ ...pinHour, startDate: String(value) });
                    }}
                    initialFocus
                    disabled={
                      appDetails['Start date'] && appDetails['End date']
                        ? {
                            before: new Date(appDetails['Start date']),
                            after: new Date(appDetails['End date']),
                          }
                        : undefined
                    }
                  />
                </PopoverContent>
              </Popover>
              <TimePicker
                onSelectTime={(time: string) => {
                  setPinHour({ ...pinHour, startTime: time });
                }}
                timeToDisplay={pinHour.startTime}
              />
            </div>
            <div
              className={
                'flex flex-row w-full items-center justify-start gap-6'
              }
            >
              <div className={'w-12 create-event-form-label'}>Closes</div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={cn(
                      'w-[160px] justify-start text-left font-normal',
                      !pinHour['endDate'] && 'text-muted-foreground'
                    )}
                  >
                    <CalendarIcon className={'mr-2'} />
                    {pinHour['endDate'] ? (
                      dayjs(pinHour['endDate']).format('ddd, MMM D')
                    ) : (
                      <span>Select a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className='w-auto p-0' align='start'>
                  <Calendar
                    mode='single'
                    selected={
                      pinHour['endDate']
                        ? new Date(pinHour['endDate'])
                        : undefined
                    }
                    onSelect={(value) => {
                      setPinHour({ ...pinHour, endDate: String(value) });
                    }}
                    initialFocus
                    disabled={
                      appDetails['Start date'] && appDetails['End date']
                        ? {
                            before: new Date(appDetails['Start date']),
                            after: new Date(appDetails['End date']),
                          }
                        : undefined
                    }
                  />
                </PopoverContent>
              </Popover>
              <TimePicker
                onSelectTime={(time: string) => {
                  setPinHour({ ...pinHour, endTime: time });
                }}
                timeToDisplay={pinHour.endTime}
              />
            </div>
          </div>
          <Button className={''} onClick={handleAddPinHour}>
            Add hours
          </Button>
        </div>
        {pinHours.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opens at</TableHead>
                <TableHead className={'text-center'}>Closes at</TableHead>
                <TableHead className={'text-end'}>Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pinHours.map((pinHour: PinHourInputs, index: number) => {
                return (
                  <TableRow key={`pin-hour-table-row-${index}`}>
                    <TableCell>
                      {dayjs(pinHour.startDate).format('ddd, MMM D')}
                      {` @ `}
                      {dayjs(pinHour.startTime, 'HH:mm:ss').format('h:mm a')}
                    </TableCell>
                    <TableCell className={'text-center'}>
                      {dayjs(pinHour.endDate).format('ddd, MMM D')}
                      {` @ `}
                      {dayjs(pinHour.endTime, 'HH:mm:ss').format('h:mm a')}
                    </TableCell>
                    <TableCell className={'text-end'}>
                      <Button
                        variant={'destructive'}
                        onClick={() => {
                          const pinHoursCopy = [...pinHours];
                          pinHoursCopy.splice(index, 1);
                          setPinHours(pinHoursCopy);
                        }}
                      >
                        X
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <div
            className={
              'p-2 border w-full mx-6 text-center bg-red-100 text-sm font-mono'
            }
          >
            This pin does not have any hours yet.
          </div>
        )}
      </div>
    );
  };

  const handleCreatePin = async () => {
    setIsLoading(true);

    const pinId = await createPost(
      imageFile as File,
      pin as Post,
      'pin',
      user,
      appId as number
    );

    await addPinHoursToDb(pinHours, pinId);
    setPin({
      longitude: null,
      latitude: null,
      address: '',
      phoneNumber: '',
      link: '',
      primaryText: '',
      secondaryText: '',
      pinCategory: '',
      pinType: '',
    });
    getAndSetMapMarkers();
    setIsLoading(false);
  };

  return (
    <div className={'flex w-full flex-col gap-4'}>
      {/* COORDINATES */}
      <div className={'flex flex-row items-center gap-2'}>
        <div
          className={
            'flex flex-col justify-center w-full rounded gap-1 text-sm'
          }
        >
          <div className={'text-sm'}>
            <span className={'font-bold text-sky-400'}>Step 1 </span>Click on a pin to edit it, or click the map to drop a new pin.
          </div>

          <div className={'flex flex-col'}>
            <div className={'flex'}>
              <div className={'flex text-sm w-full gap-2'}>
                <div className={'font-bold'}>Lat </div>
                <div>{`${pin.latitude ? Number(pin.latitude).toFixed(3) : 'N/A'}`}</div>
              </div>

              <div className={'flex text-sm w-full gap-2'}>
                <div className={'flex font-bold'}>Lng </div>
                <div>{`${pin.longitude ? Number(pin.longitude).toFixed(3) : 'N/A'}`}</div>
              </div>
            </div>

            <div className={'flex flex-row items-center text-sm gap-2'}>
              <div className='font-bold'>Address </div>
              <div className={'leading-[1.1] h-8 flex items-center'}>
                {`${pin.latitude === 0 && pin.longitude === 0 ? 'N/A' : pin.address}`}
              </div>
            </div>
          </div>
        </div>
      </div>

      <PinSelector />
      {/* IMAGE */}
      <div className={'flex flex-row items-center gap-4'}>
        <div className={'flex flex-col gap-2'}>
          <div className={'text-sm '}>
            <span className={'font-bold text-sky-400'}>Step 3 </span>Select an
            image
          </div>
          <div className={'flex w-60'}>
            <Input
              className={
                'file:text-white text-white bg-primary file:bg-primary'
              }
              ref={fileInputRef}
              disabled={isLoading}
              type='file'
              accept='image/*'
              placeholder=''
              id='upload-results'
              onChange={(event) => {
                handleFileSelection(event);
              }}
            />
          </div>
        </div>

        <div className={'flex flex-row items-center'}>
          {image ? (
            <Image
              className={'rounded'}
              alt={'The image associated with the pin being created'}
              src={image}
              height={100}
              width={100}
            />
          ) : (
            <div
              className={
                'flex items-center justify-center rounded text-center border-2 p-2 border-dashed border-neutral-600 bg-neutral-200 h-[100px] w-[100px] text-sm'
              }
            >
              <ImageOff />
            </div>
          )}
        </div>
      </div>

      {/* TEXT DETAILS */}
      <div className={'flex flex-col gap-1 w-full'}>
        <div className={'flex items-center gap-2 text-sm'}>
          <div className={'flex w-64 gap-1'}>
            <span className={'text-sky-400 font-bold'}>Step 4 </span>Add details
          </div>
          <Input
            name={'primaryText'}
            value={pin.primaryText}
            onChange={handleTextInput}
            placeholder='Pin title'
            className={'w-full text-center'}
          />
        </div>
        <div className={'flex flex-row items-center gap-1 w-full'}>
          <Input
            placeholder='Phone # (optional)'
            value={pin.phoneNumber as string}
            name={'phoneNumber'}
            onChange={handleTextInput}
            className={'w-1/2 text-center'}
          />
          <Input
            placeholder='Website link (optional)'
            value={pin.link as string}
            name={'link'}
            onChange={handleTextInput}
            className={'w-1/2 text-center'}
          />
        </div>
        <div className={'flex flex-row items-center gap-1'}>
          <Input
            placeholder='Description'
            value={pin.secondaryText}
            name={'secondaryText'}
            onChange={handleTextInput}
            className={'w-full text-center'}
          />
        </div>
      </div>

      {/* PIN HOURS */}
      <div className={'flex flex-col gap-2'}>
        <Popover>
          <PopoverTrigger asChild>
            <Button>
              <div className={'text-sm'}>
                <span className={'text-sky-400 font-bold'}>Step 5 </span>
                Add Pin Hours (optional)
              </div>
            </Button>
          </PopoverTrigger>
          <PopoverContent className={'flex w-[600px] grow'}>
            <PinHours />
          </PopoverContent>
        </Popover>
      </div>
      <Separator className={'my-2'} />
      <Button
        className={'bg-sky-500 w-48 mx-auto'}
        onClick={() => handleCreatePin()}
      >
        Add pin
      </Button>
    </div>
  );
};

export default PinPopup;
