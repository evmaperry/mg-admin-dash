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

const RoutePopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setRouteMarkerIcon: (category: string) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, setRouteMarkerIcon, user, getAndSetMapMarkers }) => {
  const [route, setRoute] = useState<Partial<Route>>({
    routeCategory: '',
    primaryText: '',
    secondaryText: '',
    photoURL: '',
    color: '',
    startDateTime: '',
    endDateTime: '',
    link: '',
    phoneNumber: '',
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
            <li>Click else where on the map to start a new route</li>
          </ul>
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
      </div>
      <RouteSelector />
    </div>
  );
};

export default RoutePopup;
