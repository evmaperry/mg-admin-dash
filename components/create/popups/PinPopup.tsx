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

const PinPopup: React.FC<{ lastClickEvent: any }> = ({ lastClickEvent }) => {
  const [pin, setPin] = useState<{
    longitude: number| null;
    latitude: number| null;
    address: number| null;
    phoneNumber: number | null;
    primaryText:string;
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
        data.append('file', file, 'resultados.pdf');

        const response = await uploadFileS3({
          route: `photo-${'photo-1'}/result`,
          fileName: 'newPhoto', // estimate.qrId,
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
    console.log('urlInside', url);
    setPhotoUrl(url);
  };

  const [photoUrl, setPhotoUrl] = useState<string>();

  useEffect(() => {
    getPhotoUrl();
  }, []);

  return (
    <div
      className={
        'flex flex-col items-center w-1/2 p-3 gap-3 border bg-neutral-50 rounded'
      }
    >
      <div>Add Pins</div>

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
