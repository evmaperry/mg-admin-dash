import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User } from '@supabase/supabase-js';
import { MapMouseEvent } from 'mapbox-gl';
import { Route } from 'mgtypes/types/Content';
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import dayjs from 'dayjs';
import { Calendar } from '@/components/ui/calendar';
import { useCreateAppStore } from '@/providers/create-app-provider';
import TimePicker from '@/components/time-picker';

const RoutePopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setRouteMarkerIcon: (category: string) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, setRouteMarkerIcon, user, getAndSetMapMarkers }) => {

    const { appDetails, setCanSave, appId } = useCreateAppStore((state) => state);



  const [route, setRoute] = useState<Partial<Route>>({
    routeCategory: '',
    primaryText: '',
    secondaryText: '',
    photoURL: '',
    color: '',
    //startDateTime: '',
    //endDateTime: '',
    link: '',
    phoneNumber: '',
  });

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
          <Button>
            {route.routeCategory ? (
              <div className={'flex flex-row items-center gap-2'}>
                <Image
                  src={`/assets/images/route-${route.routeCategory}-start.png`}
                  height={24}
                  width={24}
                  alt={'alt'}
                />
                <div>{capitalize(route.routeCategory)}</div>
              </div>
            ) : (
              <div>
                <span className={'font-bold text-sky-400'}>Step 2 </span>Select
                a Route Type
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {CreateAppMarkers.route.map(
            (routeCategory: string, index: number) => {
              return (
                <DropdownMenuItem
                  key={`route-dropdown-option-${index}`}
                  className={'flex flex-row items-center gap-2'}
                  onClick={() => {
                    setRoute({ ...route, routeCategory });
                    setRouteMarkerIcon(routeCategory);
                  }}
                >
                  <Image
                    src={`/assets/images/route-${routeCategory}-start.png`}
                    height={24}
                    width={24}
                    alt={'alt'}
                  />
                  <div>
                    {capitalize(routeCategory.replaceAll('_', ' '))}
                  </div>{' '}
                </DropdownMenuItem>
              );
            }
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  return (
    <div className={'flex w-full flex-col gap-4'}>
      <div
        className={'flex flex-col justify-center w-full rounded gap-1 text-sm'}
      >
        <div className={'text-sm'}>
          <span className={'font-bold text-sky-400'}>Step 1 </span>
          <ul>
            <li>Click on a route's line to add a new turn</li>
            <li>Click and drag a turn to move it</li>
            <li>Click elsewhere on the map to start a new route</li>
          </ul>
          {/* <div className={'font-bold'}>Turns</div>
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
          )} */}
        </div>
      </div>
      <RouteSelector />
      <div className={'flex flex-col gap-1'}>
          <div className={'flex flex-row items-center gap-1'}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-light w-1/2',
                    !dateTimes.startDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={'mr-2'} />
                  {dateTimes.endDate ? (
                    dayjs(dateTimes.startDate).format('ddd, MMM D')
                  ) : (
                    <span>Start date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    dateTimes['startDate']
                      ? new Date(dateTimes['startDate'])
                      : undefined
                  }
                  onSelect={(value) => {
                    setDateTimes({ ...dateTimes, startDate: String(value) });
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
                setDateTimes({ ...dateTimes, startTime: time });
              }}
              timeToDisplay={dateTimes.startTime}
              hint={'Start time'}
              triggerClassName='w-1/2'
            />
          </div>
          <div className={'flex flex-row items-center gap-1'}>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'justify-start text-left font-light w-1/2',
                    !dateTimes['endDate'] && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={'mr-2'} />
                  {dateTimes['endDate'] ? (
                    dayjs(dateTimes['endDate']).format('ddd, MMM D')
                  ) : (
                    <span>End date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={
                    dateTimes['endDate']
                      ? new Date(dateTimes['endDate'])
                      : undefined
                  }
                  onSelect={(value) => {
                    setDateTimes({ ...dateTimes, endDate: String(value) });
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
                setDateTimes({ ...dateTimes, endTime: time });
              }}
              timeToDisplay={dateTimes.endTime}
              hint={'End time'}
              triggerClassName='w-1/2'
            />
          </div>
        </div>
    </div>
  );
};

export default RoutePopup;
