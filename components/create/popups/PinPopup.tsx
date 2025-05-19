'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { uploadFileS3, createPresignedUrlWithClient } from '@/actions';
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
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import dayjs from 'dayjs';

const PinPopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setMarkerIcon: (icon: React.ReactElement) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, setMarkerIcon, getAndSetMapMarkers }) => {
  const { appDetails } = useCreateAppStore((state) => state);

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
        acc = acc.concat();
        return acc;
      },
      []
    );

    return (
      <div className={'flex flex-col gap-2 justify-center items-center'}>
        <div className={'create-event-form-title'}>Pin type</div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>
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
                'Select a Pin'
              )}
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuGroup className={'flex flex-col'}>
              {dropdownMenuGroup}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
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

  const handleCreatePost = async () => {
    setIsLoading(true);
    await createPost(imageFile as File, pin as Post, 'pin', user, 1);
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

  const [arePinHoursVisible, setArePinHoursVisible] = useState<boolean>(false);

  // for each day a pin has opening and closing dateTimes
  const [pinHours, setPinHours] = useState<any>();

  useEffect(() => {
    const start = dayjs(appDetails['Start date']);
    const end = dayjs(appDetails['End date']);
    const diff = end.diff(start, 'day');
    const dateArray=[];

    for (let i = 0; i < diff; i++) {
      console.log('iterating', i, start)
      const date = start.add(i, 'day').format('YYYY-MM-DD');
      dateArray.push(date)

     //pinHours[date] = { openTime:'9:00', closeTime: `17:00` };
    }

    const pinHours: {
      [date: string]: { openTime: string; closeTime: string };
    } = {};

    console.log('dateArray', dateArray)

    //setPinHours(pinHours);
  }, [appDetails['Start date'], appDetails['End date']]);

  const PinHours: React.FC<{}> = ({}) => {
    return <div></div>;
  };

  console.log('pinHours', pinHours, appDetails)

  return (
    <div className={' flex w-full flex-col gap-4'}>
      {/* COORDINATES */}
      <div className={'flex flex-row items-center gap-4'}>
        <div className={'w-20 create-event-form-title'}>Location</div>
        <div
          className={
            'flex flex-col justify-center w-full border bg-neutral-300 p-3 rounded gap-1'
          }
        >
          <div className={'text-center font-mono text-sm'}>
            Click the map to locate your new pin
          </div>
          <div className={'flex flex-row items-center justify-between'}>
            <div className={'text-sm'}>
              <span className={'font-bold'}>Lat:</span>{' '}
              {`${pin.latitude ? Number(pin.latitude).toFixed(3) : 'N/A'}`}
            </div>

            <div className={'text-sm'}>
              <span className={'font-bold'}>Lng: </span>
              {`${pin.longitude ? Number(pin.longitude).toFixed(3) : 'N/A'}`}
            </div>
            <div className={'text-sm'}>
              <span className='font-bold'>Address:</span>{' '}
              {`${pin.latitude === 0 && pin.longitude === 0 ? 'N/A' : pin.address}`}
            </div>
          </div>
        </div>
      </div>

      {/* PIN TYPE */}

      <div
        className={'flex flex-row items-center justify-between w-full gap-4'}
      >
        <PinSelector />
        {/* IMAGE */}
        <div className={'flex flex-row items-center gap-4'}>
          <div className={'flex flex-col justify-center items-center gap-2'}>
            <div className={'w-20 create-event-form-title'}>Image</div>
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
                Select a photo 👉
              </div>
            )}
          </div>
        </div>
      </div>

      {/* TEXT */}
      <div className={'flex flex-col gap-1 text-center'}>
        <div className={'create-event-form-title'}>Details</div>
        <div className={'flex flex-row items-center gap-1'}>
          <Input
            name={'primaryText'}
            value={pin.primaryText}
            onChange={handleTextInput}
            placeholder='Pin title'
            className={'w-1/3'}
          />
          <Input
            placeholder='Description'
            value={pin.secondaryText}
            name={'secondaryText'}
            onChange={handleTextInput}
            className={'w-2/3'}
          />
        </div>

        <div className={'flex flex-row items-center gap-1'}>
          <Input
            placeholder='Phone number (optional)'
            value={pin.phoneNumber as string}
            name={'phoneNumber'}
            onChange={handleTextInput}
          />
          <Input
            placeholder='Website link (optional)'
            value={pin.link as string}
            name={'link'}
            onChange={handleTextInput}
          />
        </div>
      </div>

      {/* PIN HOURS */}
      <div className={'flex flex-col items-center gap-2'}>
        <div className={'create-event-form-title'}>Pin Hours</div>
        <div className={'flex flex-row items-center gap-2 bg-neutral-200 p-3'}>
          <div className={'text-sm leading-[1.1] w-1/2'}>
            Adding a pin's hours is optional; they indicate whether a pin is
            open or closed.
          </div>
          <div
            className={'flex flex-row items-center gap-1 justify-center w-1/2'}
          >
            <Checkbox
              onCheckedChange={(checkState: boolean) => {
                setArePinHoursVisible(checkState);
              }}
            />
            <Label>Add hours to this pin</Label>
          </div>
        </div>
        {arePinHoursVisible && <PinHours />}
      </div>

      <Button className={'mx-auto'} onClick={() => handleCreatePost()}>
        Add pin
      </Button>
    </div>
  );
};

export default PinPopup;
