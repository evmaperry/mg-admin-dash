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

const PinPopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setMarkerIcon: (icon: React.ReactElement) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, setMarkerIcon, getAndSetMapMarkers }) => {
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
      <div className={'flex flex-row items-center'}>
        <div className={'w-20'}>Pin type</div>
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

  return (
    <div>
      <div className={' flex w-full flex-col gap-6'}>
        {/* COORDINATES */}
        <div className={'flex flex-row items-center gap-4'}>
          <div className={'w-20'}>Location</div>
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
                <span className={'font-bold'}>Latitude:</span>{' '}
                {`${pin.latitude ? Number(pin.latitude).toFixed(3) : 'N/A'}`}
              </div>

              <div className={'text-sm'}>
                <span className={'font-bold'}>Longitude: </span>
                {`${pin.longitude ? Number(pin.longitude).toFixed(3) : 'N/A'}`}
              </div>
            </div>

            <div className={'text-sm'}>
              <span className='font-bold'>Address:</span>{' '}
              {`${pin.address && pin.address.length > 0 && pin.latitude !== 0 && pin.address}`}
            </div>
          </div>
        </div>

        {/* PIN TYPE */}
        <PinSelector />

        {/* IMAGE */}
        <div className={'flex flex-row items-center flex-start'}>
          <div className={'w-20'}>Image</div>
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
          <div className={'flex ml-4 w-60'}>
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

        {/* TEXT */}
        <div className={'flex flex-col gap-2'}>
          <div className={'flex flex-row items-center gap-6'}>
            <div>Details</div>{' '}
            <Input
              name={'primaryText'}
              value={pin.primaryText}
              onChange={handleTextInput}
              placeholder='Pin title'
            />
          </div>

          <Input
            placeholder='Description'
            value={pin.secondaryText}
            name={'secondaryText'}
            onChange={handleTextInput}
          />
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

        <Button className={'mx-auto'} onClick={() => handleCreatePost()}>
          Add pin
        </Button>
      </div>

      <div>Current Pins</div>
      {/* <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Text</TableHead>
            <TableHead>Category / Type</TableHead>
            <TableHead>Image</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {mapPins.map((pin, index) => {
            return (
              <TableRow key={`map-pin-table-row-${index}`}>
                <TableCell>{pin.primaryText}</TableCell>
                <TableCell>
                  {pin.pinType} / {pin.pinCategory}
                </TableCell>
                <TableCell>ImAgE</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table> */}
    </div>
  );
};

export default PinPopup;
