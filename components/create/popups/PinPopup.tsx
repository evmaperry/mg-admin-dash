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
import { Contentable, Pin, Post } from 'mgtypes/types/Content';
import dayjs from 'dayjs';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon, ImageOff, Info, MapPin, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import TimePicker from '@/components/time-picker';
import { addPinHoursToDb } from '@/actions';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import HoursPicker, { HourInputs } from '@/components/hours-picker';

dayjs.extend(customParseFormat);

const PinPopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setPinMarkerIcon: (category: string, type: string) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, setPinMarkerIcon, getAndSetMapMarkers }) => {
  const { appDetails, setCanSave, appId } = useCreateAppStore((state) => state);

  const defaultPinState = {
    longitude: null,
    latitude: null,
    address: '',
    phoneNumber: '',
    link: '',
    primaryText: '',
    secondaryText: '',
    pinCategory: '',
    pinType: '',
  };

  const [pin, setPin] = useState<Partial<Pin>>(defaultPinState);

  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMapClick = async () => {
    const address = await getAddressFromCoordinates(
      lastClickEvent?.lngLat.lat as number,
      lastClickEvent?.lngLat.lng as number
    );

    const formattedAddress = address.split(',').slice(0, 2).join(',');

    setPin({
      ...pin,
      longitude: lastClickEvent?.lngLat.lng ?? 0,
      latitude: lastClickEvent?.lngLat.lat ?? 0,
      address: formattedAddress,
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
                        setPinMarkerIcon(cur[0], pinType);
                        // <Image
                        //   src={`/assets/images/pin-${cur[0]}-${pinType}.png`}
                        //   height={36}
                        //   width={36}
                        //   alt={'Pin image'}
                        //   className={
                        //     'border border-neutral-500 rounded-full p-[2px] bg-background'
                        //   }
                        // />
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
          <Button variant={'outline'} className={'font-light h-8 w-48 mx-auto'}>
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
              'Select a pin type'
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

  // send thru to hours-picker
  const [pinHours, setPinHours] = useState<HourInputs[]>([]);

  // const [pinHour, setPinHour] = useState<PinHourInputs>({
  //   startDate: undefined,
  //   startTime: undefined,
  //   endDate: undefined,
  //   endTime: undefined,
  // });

  // const handleAddPinHour = () => {
  //   // TODO: add form validation
  //   setPinHours([...pinHours, pinHour]);
  //   setPinHour({
  //     startDate: undefined,
  //     startTime: undefined,
  //     endDate: undefined,
  //     endTime: undefined,
  //   });
  //   setImage(undefined);
  //   setImageFile(undefined);
  // };

  // const PinHours: React.FC<{}> = ({}) => {
  //   return (
  //     <div className={'flex flex-col items-center w-full gap-4'}>
  //       <div
  //         className={'flex flex-row items-center gap-4 w-full justify-around'}
  //       >
  //         <div className={'flex flex-col gap-1'}>
  //           <div
  //             className={
  //               'flex flex-row items-center w-full justify-start gap-6'
  //             }
  //           >
  //             <div className={'w-12 create-event-form-label'}>Opens</div>
  //             <Popover>
  //               <PopoverTrigger asChild>
  //                 <Button
  //                   variant={'outline'}
  //                   className={cn(
  //                     'w-[160px] justify-start text-left font-normal',
  //                     !pinHour['startDate'] && 'text-muted-foreground'
  //                   )}
  //                 >
  //                   <CalendarIcon className={'mr-2'} />
  //                   {pinHour['startDate'] ? (
  //                     dayjs(pinHour['startDate']).format('ddd, MMM D')
  //                   ) : (
  //                     <span>Select a date</span>
  //                   )}
  //                 </Button>
  //               </PopoverTrigger>
  //               <PopoverContent className='w-auto p-0' align='start'>
  //                 <Calendar
  //                   mode='single'
  //                   selected={
  //                     pinHour['startDate']
  //                       ? new Date(pinHour['startDate'])
  //                       : undefined
  //                   }
  //                   onSelect={(value) => {
  //                     setPinHour({ ...pinHour, startDate: String(value) });
  //                   }}
  //                   initialFocus
  //                   disabled={
  //                     appDetails['Start date'] && appDetails['End date']
  //                       ? {
  //                           before: new Date(appDetails['Start date']),
  //                           after: new Date(appDetails['End date']),
  //                         }
  //                       : undefined
  //                   }
  //                 />
  //               </PopoverContent>
  //             </Popover>
  //             <TimePicker
  //               onSelectTime={(time: string) => {
  //                 setPinHour({ ...pinHour, startTime: time });
  //               }}
  //               timeToDisplay={pinHour.startTime}
  //               hint={'Time'}
  //               triggerClassName=''
  //             />
  //           </div>
  //           <div
  //             className={
  //               'flex flex-row w-full items-center justify-start gap-6'
  //             }
  //           >
  //             <div className={'w-12 create-event-form-label'}>Closes</div>
  //             <Popover>
  //               <PopoverTrigger asChild>
  //                 <Button
  //                   variant={'outline'}
  //                   className={cn(
  //                     'w-[160px] justify-start text-left font-normal',
  //                     !pinHour['endDate'] && 'text-muted-foreground'
  //                   )}
  //                 >
  //                   <CalendarIcon className={'mr-2'} />
  //                   {pinHour['endDate'] ? (
  //                     dayjs(pinHour['endDate']).format('ddd, MMM D')
  //                   ) : (
  //                     <span>Select a date</span>
  //                   )}
  //                 </Button>
  //               </PopoverTrigger>
  //               <PopoverContent className='w-auto p-0' align='start'>
  //                 <Calendar
  //                   mode='single'
  //                   selected={
  //                     pinHour['endDate']
  //                       ? new Date(pinHour['endDate'])
  //                       : undefined
  //                   }
  //                   onSelect={(value) => {
  //                     setPinHour({ ...pinHour, endDate: String(value) });
  //                   }}
  //                   initialFocus
  //                   disabled={
  //                     appDetails['Start date'] && appDetails['End date']
  //                       ? {
  //                           before: new Date(appDetails['Start date']),
  //                           after: new Date(appDetails['End date']),
  //                         }
  //                       : undefined
  //                   }
  //                 />
  //               </PopoverContent>
  //             </Popover>
  //             <TimePicker
  //               onSelectTime={(time: string) => {
  //                 setPinHour({ ...pinHour, endTime: time });
  //               }}
  //               timeToDisplay={pinHour.endTime}
  //               hint='Time'
  //               triggerClassName=''
  //             />
  //           </div>
  //         </div>
  //         <Button className={''} onClick={handleAddPinHour}>
  //           Add hours
  //         </Button>
  //       </div>
  //       {pinHours.length > 0 ? (
  //         <Table>
  //           <TableHeader>
  //             <TableRow>
  //               <TableHead>Opens at</TableHead>
  //               <TableHead className={'text-center'}>Closes at</TableHead>
  //               <TableHead className={'text-end'}>Remove</TableHead>
  //             </TableRow>
  //           </TableHeader>
  //           <TableBody>
  //             {pinHours.map((pinHour: PinHourInputs, index: number) => {
  //               return (
  //                 <TableRow key={`pin-hour-table-row-${index}`}>
  //                   <TableCell>
  //                     {dayjs(pinHour.startDate).format('ddd, MMM D')}
  //                     {` @ `}
  //                     {dayjs(pinHour.startTime, 'HH:mm:ss').format('h:mm a')}
  //                   </TableCell>
  //                   <TableCell className={'text-center'}>
  //                     {dayjs(pinHour.endDate).format('ddd, MMM D')}
  //                     {` @ `}
  //                     {dayjs(pinHour.endTime, 'HH:mm:ss').format('h:mm a')}
  //                   </TableCell>
  //                   <TableCell className={'text-end'}>
  //                     <Button
  //                       variant={'destructive'}
  //                       onClick={() => {
  //                         const pinHoursCopy = [...pinHours];
  //                         pinHoursCopy.splice(index, 1);
  //                         setPinHours(pinHoursCopy);
  //                       }}
  //                     >
  //                       X
  //                     </Button>
  //                   </TableCell>
  //                 </TableRow>
  //               );
  //             })}
  //           </TableBody>
  //         </Table>
  //       ) : (
  //         <div
  //           className={
  //             'p-2 border w-full mx-6 text-center bg-red-100 text-sm font-mono'
  //           }
  //         >
  //           This pin does not have any hours yet.
  //         </div>
  //       )}
  //     </div>
  //   );
  // };

  const handleCreatePin = async () => {
    setIsLoading(true);

    const pinId = await createPost(
      imageFile as File,
      pin as Contentable,
      'pin',
      user,
      appId as number
    );

    await addPinHoursToDb(pinHours, pinId);
    setPin(defaultPinState);
    getAndSetMapMarkers();
    setIsLoading(false);
  };

  return (
    <div className={'flex flex-col h-full w-full gap-2'}>
      <div className={'flex items-center justify-between w-full'}>
        <div className={'flex items-center gap-2'}>
          <div className={'create-app-form-subtitle'}>MARKER TYPE:</div>
          <div className={'create-app-form-subtitle text-indigo-600 font-bold'}>
            PIN
          </div>
          <MapPin className={'text-indigo-600'} />
        </div>

        <Popover>
          <PopoverContent className={'instructions-container'}>
            <Label>Step 1</Label>
            <div>
              Click the map to drop a new pin. The coordinates and address (if
              available) will display in the panel. You can also click on an
              existing pin to edit it.
            </div>
            <Label>Step 2</Label>
            <div>Select the pin type.</div>
            <Label>Step 3</Label>
            <div>Select an image for the pin.</div>
            <Label>Step 4</Label>
            <div>Add details.</div>
            <Label>Step 5</Label>
            <div>
              Add hours of operation to the pins. Pin hours are optional and allow a pin to indicate
              hours of operation should they differ from the event's hours.
            </div>
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button variant={'instructions'} size={'sm'}>
              <Info />
              Instructions
            </Button>
          </PopoverTrigger>
        </Popover>
      </div>
      <Separator />
      {/* BODY */}
      <div
        className={'flex w-full flex-col items-between h-full justify-between'}
      >
        {/* COORDINATES */}
        <div
          className={
            'flex flex-col justify-center w-full rounded gap-1 text-sm'
          }
        >
          <div className={'flex text-sm flex-row justify-between items-center'}>
            <Label>Location</Label>
            <div className={'flex'}>
              <div className={'italic w-8'}>Lat:</div>
              <div
                className={'w-16'}
              >{`${pin.latitude ? Number(pin.latitude).toFixed(3) : 'N/A'}`}</div>
            </div>

            <div className={'flex'}>
              <div className={'italic w-8'}>Lng:</div>
              <div
                className={'w-16'}
              >{`${pin.longitude ? Number(pin.longitude).toFixed(3) : 'N/A'}`}</div>
            </div>
          </div>

          <div className={'flex gap-1'}>
            <div className={'flex gap-1 truncate'}>
              <div className={'italic w-16'}>Address:</div>
              <div className={''}>
                {pin.latitude === 0 && pin.longitude === 0
                  ? 'N/A'
                  : pin.address}
              </div>
            </div>
          </div>
        </div>

        {/* PIN SELECTOR */}

        <div className={'flex items-center'}>
          <Label>Type</Label> <PinSelector />
        </div>

        {/* IMAGE */}
        <div className={'flex flex-row items-center gap-4'}>
          <div className={'flex flex-col gap-2'}>
            <Label>Image</Label>

            <div className={'flex w-60'}>
              <Input
                className={'popup-file-input'}
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
                height={75}
                width={75}
              />
            ) : (
              <div
                className={
                  'flex items-center justify-center rounded text-center border-2 p-2 border-dashed border-neutral-600 bg-neutral-200 h-[75px] w-[75px] text-sm'
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
            <div className={'flex w-40 gap-4'}>
              <Label>Details</Label>
            </div>
            <Input
              name={'primaryText'}
              value={pin.primaryText}
              onChange={handleTextInput}
              placeholder='Pin title'
              className={'w-full text-center h-8'}
            />
          </div>
          <div className={'flex flex-row items-center gap-1'}>
            <Input
              placeholder='Description'
              value={pin.secondaryText}
              name={'secondaryText'}
              onChange={handleTextInput}
              className={'w-full text-center h-8'}
            />
          </div>
          <div className={'flex flex-row items-center gap-1 w-full'}>
            <Input
              placeholder='Phone (optional)'
              value={pin.phoneNumber as string}
              name={'phoneNumber'}
              onChange={handleTextInput}
              className={'w-1/2 text-center h-8'}
            />
            <Input
              placeholder='Link (optional)'
              value={pin.link as string}
              name={'link'}
              onChange={handleTextInput}
              className={'w-1/2 text-center h-8'}
            />
          </div>
        </div>
        {/* PIN HOURS */}
        <div className={'flex flex-row items-center gap-4 text-sm'}>
          <div className={'flex items-center gap-1'}>
            <Label>Hours </Label>
            <div>(optional)</div>
          </div>

          <HoursPicker
            hoursBundle={{ hours: pinHours, setHours: setPinHours }}
          />
        </div>
      </div>
      <Separator />
      <div className={'flex items-center w-full gap-2'}>
        <Button
          className={'bg-indigo-600 w-full items-center gap-2'}
          onClick={() => handleCreatePin()}
        >
          <MapPin /> Add pin
        </Button>
        <Button
          className={'w-full gap-2'}
          variant={'destructive'}
          onClick={() => {
            setPin(defaultPinState);
          }}
        >
          <X /> Cancel
        </Button>
      </div>
    </div>
  );
};

export default PinPopup;
