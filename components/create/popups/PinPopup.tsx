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
import { nanoid } from 'nanoid';
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

const PinPopup: React.FC<{ lastClickEvent: any }> = ({ lastClickEvent }) => {
  const [pin, setPin] = useState<{
    longitude: number | null;
    latitude: number | null;
    address: number | null;
    phoneNumber: number | null;
    primaryText: string;
    pinCategory: string;
    pinType: string;
  }>();

  const { mapPins } = useCreateAppStore((state) => state);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  console.log('lce', lastClickEvent);

  const handleResultsUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
    //estimate: any
  ) => {
    console.log('event', event);
    try {
      setIsLoading(true);
      if (event.target.files) {
        const file = event.target.files[0];
        const data = new FormData();
        data.append('file', file);

        const response = await uploadFileS3({
          key: nanoid(),
          content: data,
        });

        response.ok
          ? console.log('Results achieved')
          : console.log('There be an error');
      }
    } catch (error) {
      console.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const getPhotoUrl = async () => {
    const url = await createPresignedUrlWithClient({
      bucket: 'mg-photos-and-videos',
      key: 'photo-photo-1/result/newPhoto',
    });
    setPhotoUrl(url);
  };

  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => {
    getPhotoUrl();
  }, []);

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

                  const imgSRC = `../../../node_modules/mgmarkers/markerImages/pin-${cur[0]}-${pinType}.png`

                  //const imgSRC = '/pin-default-pin.png'

                  return (
                    <DropdownMenuItem
                      key={`dropdown-pin-type-${index}-${index2}`}
                    >
                      <Image
                        src={`/assets/images/pin-${cur[0]}-${pinType}.png`}
                        height={24}
                        width={24}
                        alt={'alt'}
                      />
                      {capitalize(pinType.replaceAll('_', ' '))}
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
      <div className={'border'}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Select a Pin</Button>
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

  return (
    <div
      className={
        'flex flex-col items-center w-1/2 p-3 gap-3 border bg-neutral-50 rounded'
      }
    >
      <div>Add Pins</div>

      <PinSelector />
      <div></div>

      <Input
        ref={fileInputRef}
        disabled={isLoading}
        type='file'
        accept='image/*'
        placeholder='Resultados'
        id='upload-results'
        onChange={async (event) => {
          await handleResultsUpload(event);
        }}
      />

      {photoUrl && <img src={photoUrl} height={100} width={100} />}

      <div>Current Pins</div>
      <Table>
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
      </Table>
    </div>
  );
};

export default PinPopup;
