import React, { useState, useEffect } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table';
import { useCreateAppStore } from '@/providers/create-app-provider';
import Image from 'next/image';
import { Pin } from 'mgtypes/types/Content';
import { Button } from '../ui/button';
import capitalize from 'lodash/capitalize';
import { createPresignedUrlWithClient } from '@/actions';

const MapMarkerTable: React.FC<{}> = ({}) => {
  const [selectedTab, setSelectedTab] = useState<string>('pins');
  const { pins } = useCreateAppStore((state) => state.markers);

  const ImageCell: React.FC<{ photoURL: string }> = ({ photoURL }) => {
    const [presignedURL, setPresignedURL] = useState<string>('');

    const getAndSetPresignedURL = async () => {
      try{
        const presignedURL = await createPresignedUrlWithClient({
        key: photoURL,
        bucket: 'mg-app-drafts',
      });
      setPresignedURL(presignedURL);}
      catch (e) {
        console.error("CLIENT ERROR: failed to get and set presigned url in MapMarkerTable's ImageCell", e)
      }
    };

    useEffect(() => {
      getAndSetPresignedURL();
    }, []);

    return (
      <TableCell
        className={'flex items-center justify-center'}
      >
        {presignedURL.length > 0 && (
          <img
            src={presignedURL as string}
            height={60}
            width={60}
            alt={'Pin table row image'}
            className='rounded-lg'
          />
        )}
      </TableCell>
    );
  };

  const PinsTable: React.FC<{}> = ({}) => {
    console.log('pins', pins)
    return (
      <>
        <TableHeader>
          <TableRow>
            <TableHead className={'text-center'}>Image</TableHead>
            <TableHead className={'text-center'}>Category</TableHead>
            <TableHead className={'text-center'}>Type</TableHead>
            <TableHead className={'text-center'}>Address</TableHead>
            <TableHead className={'text-center'}>Edit</TableHead>
            <TableHead className={'text-end'}>Delete</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pins && pins.map((pin: Pin, index: number) => {

            console.log
            return (
              <TableRow className={''} key={`pin-table-row-${index}`}>
                <ImageCell photoURL={pin.photoURL as string} />

                <TableCell className={'text-center'}>
                  {capitalize(pin.pinCategory)}
                </TableCell>
                <TableCell className={'text-center'}>
                  {capitalize(pin.pinType)}
                </TableCell>
                <TableCell className={'text-center'}>
                  {pin.address
                    .split(',').slice(0,2)
                    .map((split: string, splitIndex: number) => {
                      return (
                        <div key={`${split} - ${splitIndex}`}>{split}</div>
                      );
                    })}
                </TableCell>
                <TableCell className={'text-center'}>
                  <Button>Edit</Button>
                </TableCell>
                <TableCell className={'text-end'}>
                  <Button variant={'destructive'}>Delete</Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </>
    );
  };


  return (
    <div className={'w-full border'}>
      <ToggleGroup
        value={selectedTab}
        onValueChange={setSelectedTab}
        variant={'outline'}
        type='single'
      >
        <ToggleGroupItem value='pins'>Pins</ToggleGroupItem>
        <ToggleGroupItem value='plans'>Plans</ToggleGroupItem>
        <ToggleGroupItem value='routes'>Routes</ToggleGroupItem>
        <ToggleGroupItem value='areas'>Areas</ToggleGroupItem>
        <ToggleGroupItem value='structures'>Structures</ToggleGroupItem>
      </ToggleGroup>
      <Table>
        <TableCaption>Edit and delete your app's {selectedTab}</TableCaption>
        {selectedTab === 'pins' && <PinsTable />}
      </Table>
    </div>
  );
};

export default MapMarkerTable;
