import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@supabase/supabase-js';
import { MapMouseEvent } from 'mapbox-gl';
import { Contentable, Route } from 'mgtypes/types/Content';
import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import capitalize from 'lodash/capitalize';
import { CreateAppMarkers } from 'mgmarkers/markerConfig';
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
import { Position } from 'geojson';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon, ImageOff } from 'lucide-react';
import dayjs from 'dayjs';
import { Calendar } from '@/components/ui/calendar';
import { useCreateAppStore } from '@/providers/create-app-provider';
import TimePicker from '@/components/time-picker';
import DatePicker from '@/components/date-picker';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { createPost, getAddressFromCoordinates } from '../createActions';
import ColorPicker from '@/components/color-picker';
import { ColorResult } from 'react-color';

const RoutePopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  multiMarkerBundle: { setNewMultiMarker: any; newMultiMarker: any }; // TODO: type this?
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, multiMarkerBundle, user, getAndSetMapMarkers }) => {
  const { appDetails, setCanSave, appId } = useCreateAppStore((state) => state);
  const { setNewMultiMarker: setRoute, newMultiMarker: route } =
    multiMarkerBundle;

  // const [route, setRoute] = useState<Partial<Route>>({
  //   routeCategory: '',
  //   primaryText: '',
  //   secondaryText: '',
  //   photoURL: '',
  //   color: '#7e22ce',
  //   //startDateTime: '',
  //   //endDateTime: '',
  //   link: '',
  //   phoneNumber: '',
  // });

  const [dateTimes, setDateTimes] = useState<{
    startDate: string | undefined;
    startTime: string | undefined;
    endDate: string | undefined;
    endTime: string | undefined;
  }>({
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
  });

  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMapClick = () => {
    console.log('lCE', lastClickEvent);
  };

  useEffect(() => {
    handleMapClick();
  }, [lastClickEvent]);

  const RouteSelector: React.FC<{}> = ({}) => {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} className='font-light h-8'>
            {route.category ? (
              <div className={'flex flex-row items-center gap-2'}>
                <Image
                  src={`/assets/images/markers/route-${route.category}-start.png`}
                  height={24}
                  width={24}
                  alt={'wlt'}
                />
                <div>{capitalize(route.category)}</div>
              </div>
            ) : (
              <div>Select a route type</div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {CreateAppMarkers.route.map(
            (routeCategory: string, index: number) => {
              return (
                <DropdownMenuItem
                  key={`route-dropdown-option-${index}`}
                  className={
                    'flex flex-row items-center gap-2 w-36 justify-between'
                  }
                  onClick={() => {
                    console.log('RC', routeCategory);
                    setRoute({ ...route, category: routeCategory });
                  }}
                >
                  <Image
                    src={`/assets/images/markers/route-${routeCategory}-start.png`}
                    height={24}
                    width={24}
                    alt={'alt'}
                  />
                  <div>{capitalize(routeCategory.replaceAll('_', ' '))}</div>{' '}
                  <Image
                    src={`/assets/images/markers/route-${routeCategory}-finish.png`}
                    height={24}
                    width={24}
                    alt={'alt'}
                  />
                </DropdownMenuItem>
              );
            }
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const RouteColorPicker: React.FC<{}> = ({}) => {
    return (
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className={'h-8 font-light'}>
              {route.color ? (
                <div className={'flex gap-2 items-center'}>
                  <div>Color</div>
                  <div
                    className={cn('h-5 w-5 rounded')}
                    style={{ backgroundColor: route.color }}
                  />
                </div>
              ) : (
                'Select a color'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={'w-full flex flex-col items-center gap-5 w-[650px]'}
            side='left'
          >
            <div className={'font-mono font-bold'}>{'Route color'}</div>
              <div className={'leading-[1.1]'}>{'Select a color that contrasts with your chosen map theme or plays on your branding.'}</div>
            <div>
            <ColorPicker
              onChangeComplete={(
                colorResult: ColorResult,
                event: React.ChangeEvent
              ) => {
                console.log('colorRes', colorResult);
                setRoute({
                  ...route,
                  color: colorResult.hex,
                });
              }}
              initialColor={route.color as string}
            /></div>
          </PopoverContent>
        </Popover>
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
    setRoute({ ...route, [name]: value });
  };

  const handleCreateRoute = async () => {
    setIsLoading(true);

    const routeId = await createPost(
      imageFile as File,
      {
        ...route,
        startDateTime: `${dateTimes.startDate} ${dateTimes.startTime}`,
        endDateTime: `${dateTimes.endDate} ${dateTimes.endTime}`,
      } as Contentable,
      'route',
      user,
      appId as number
    );

    // await addPinHoursToDb(pinHours, pinId);
    setRoute({
      // longitude: null,
      // latitude: null,
      // address: '',
      phoneNumber: '',
      link: '',
      primaryText: '',
      secondaryText: '',
      routeCategory: '',
      color: '#7e22ce',
    });
    setDateTimes({
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
    });
    getAndSetMapMarkers();
    setIsLoading(false);
  };

  console.log('reRendering route popup');
  return (
    <div className={'flex flex-col h-full w-full gap-2'}>
      <div className={'create-app-form-subtitle'}>
        MARKER TYPE: <span className={'text-teal-400 font-bold'}>ROUTE</span>
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
          <div className={'text-sm truncate'}>
            <Label>Step 1&nbsp;&nbsp;&nbsp;&nbsp;</Label>
            Click a route to add a turn, click and drag a turn to move it, or
            click the map to start a new route
          </div>
        </div>

        {/* ROUTE SELECTOR */}
        <div className={'flex gap-4 justify-start items-center text-sm'}>
          <Label>Step 2</Label>
          <RouteSelector />
          {/* COLOR SELECTOR */}
          <RouteColorPicker />
        </div>

        {/* IMAGE */}
        <div className={'flex flex-row items-center gap-4'}>
          <div className={'flex flex-col gap-2'}>
            <div className={'text-sm flex items-center gap-4'}>
              <Label>Step 3 </Label>Select an image
            </div>
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
      </div>

      {/* NOT USED: TABLE */}
      {/* <div
        className={'flex flex-col justify-center w-full rounded gap-1 text-sm'}
      >
        <div className={'text-sm'}>
          <div className={'font-bold'}>Turns</div>
          {route.coordinates && route.coordinates.length > 0 && (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Turn #</TableHead>
                  <TableHead>Address</TableHead>
                </TableRow>
              </TableHeader>
              {route.coordinates.map((coord: Position, index: number) => {
                return (
                  <TableRow>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell></TableCell>
                  </TableRow>
                );
              })}
            </Table>
          )}
        </div>
      </div> */}

      {/* TEXT / TIMES */}
      <div className={'flex flex-col gap-1 w-full'}>
        {/* TEXT DETAILS */}
        <div className={'flex flex-col gap-1 w-full'}>
          <div className={'flex items-center gap-2 text-sm'}>
            <div className={'flex w-64 gap-4 items-center'}>
              <Label>Step 4</Label>Add details
            </div>
            <Input
              name={'primaryText'}
              value={route.primaryText}
              onChange={handleTextInput}
              placeholder='Pin title'
              className={'w-full text-center h-8'}
            />
          </div>
          <div className={'flex flex-row items-center gap-1'}>
            <Input
              placeholder='Description'
              value={route.secondaryText}
              name={'secondaryText'}
              onChange={handleTextInput}
              className={'w-full text-center h-8'}
            />
          </div>
          <div className={'flex flex-row items-center gap-1 w-full'}>
            <Input
              placeholder='Phone (optional)'
              value={route.phoneNumber as string}
              name={'phoneNumber'}
              onChange={handleTextInput}
              className={'w-1/2 text-center h-8'}
            />
            <Input
              placeholder='Link (optional)'
              value={route.link as string}
              name={'link'}
              onChange={handleTextInput}
              className={'w-1/2 text-center h-8'}
            />
          </div>
        </div>
        {/* TIMES */}
        <div className={'flex flex-col gap-1'}>
          {/* START */}
          <div className={'flex flex-row items-center justify-between gap-1'}>
            <Label className={'w-1/5 '}>Start</Label>
            <DatePicker
              onSelect={(value) => {
                setDateTimes({ ...dateTimes, startDate: String(value) });
              }}
              hint={'Date'}
              selectedDateString={dateTimes['startDate']}
              triggerClassName={cn(
                !dateTimes.endDate && 'text-muted-foreground',
                'w-2/5'
              )}
            />
            <TimePicker
              onSelectTime={(time: string) => {
                setDateTimes({ ...dateTimes, startTime: time });
              }}
              timeToDisplay={dateTimes.startTime}
              hint={'Time'}
              triggerClassName='w-2/5'
            />
          </div>

          <div className={'flex flex-row items-center gap-1'}>
            <Label className={'w-1/5 '}>End</Label>
            <DatePicker
              triggerClassName={cn(
                !dateTimes.endDate && 'text-muted-foreground',
                'w-2/5'
              )}
              hint='Date'
              onSelect={(value) => {
                setDateTimes({ ...dateTimes, endDate: String(value) });
              }}
              selectedDateString={dateTimes['endDate']}
            />
            <TimePicker
              onSelectTime={(time: string) => {
                setDateTimes({ ...dateTimes, endTime: time });
              }}
              timeToDisplay={dateTimes.endTime}
              hint={'Time'}
              triggerClassName='w-2/5'
            />
          </div>
        </div>
      </div>
      <Separator />
      <Button
        className={'bg-teal-400 w-48 mx-auto'}
        onClick={() => handleCreateRoute()}
      >
        Add route
      </Button>
    </div>
  );
};

export default RoutePopup;
