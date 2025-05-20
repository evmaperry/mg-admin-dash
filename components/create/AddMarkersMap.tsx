'use client';
import React, { useEffect, useState } from 'react';
import {
  Map,
  MapMouseEvent,
  Marker,
  NavigationControl,
  Popup,
} from 'react-map-gl/mapbox';
import { useCreateAppStore } from '@/providers/create-app-provider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { type } from 'os';
import { Button } from '../ui/button';
import { Switch } from '../ui/switch';
import PinPopup from './popups/PinPopup';
import PlanPopup from './popups/PlanPopup';
import RoutePopup from './popups/RoutePopup';
import AreaPopup from './popups/AreaPopup';
import StructurePopup from './popups/StructurePopup';
import { Crosshair, Smile, TreeDeciduous } from 'lucide-react';
import { Position } from 'geojson';
import { User } from '@supabase/supabase-js';
import { getMapMarkersFromDb } from './createActions';
import CustomMapMarker from './popups/CustomMapMarker';
import { Separator } from '../ui/separator';
import 'mapbox-gl/dist/mapbox-gl.css';
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
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type MarkerType = 'pin' | 'plan' | 'route' | 'area' | 'structure' | null;

const AddMarkersMap: React.FC<{ user: User }> = ({ user }) => {
  const { mapTheme, centerMapViewState, markers, setMarkers, appDetails } =
    useCreateAppStore((state) => state);

  const [selectedMarkerType, setSelectedMarkerType] =
    useState<MarkerType>(null);

  const MarkerTypeInstructions = {
    pin: 'Pins indicate the location of services and points of interest: bathrooms, vendors, emergency services, and so on. A pin can have hours of operations.',
    plan: 'Plans indicate the location of an event that start and end at fixed times. Your guests can RSVP to plans and share them with their friends.',
    route:
      'Routes illustrate a path that will be traveled by event guests, like a parade or footrace. Routes have start and end times.',
    area: 'Areas divide your event footprint into colored zones on the map.',
    structure:
      'Structures display as three-dimensional shapes on your map. They can represent tents, stages, vendor booths, and so on.',
  };

  const [newMarker, setNewMarker] = useState<{
    isVisible: boolean;
    coordinates: Position | null;
    event: null | MapMouseEvent;
    icon: React.ReactElement;
  }>({
    isVisible: false,
    coordinates: null,
    event: null,
    icon: <Crosshair />,
  });

  const setMarkerIcon = (icon: React.ReactElement) => {
    console.log('set marker');
    setNewMarker({
      ...newMarker,
      icon,
    });
  };

  const getAndSetMapMarkers = async () => {
    try {
      const markers = await getMapMarkersFromDb(1);
      setMarkers(markers);
    } catch (e) {
      console.error('ADDMARKERMAP ERROR: failed to get and set markers', e);
    }
  };

  useEffect(() => {
    getAndSetMapMarkers();
  }, []);

  console.log('appDeetails', appDetails);

  return (
    <div className={'flex w-full'}>
      {centerMapViewState === null ? (
        <div className={'text-center rounded bg-red-200 p-2 w-full'}>
          Center your event above before adding markers and features to the map.
        </div>
      ) : (
        <div className={'flex flex-col items-center w-full gap-4'}>
          <div className={'flex flex-row w-full justify-between gap-3'}>
            <div className={'flex rounded overflow-hidden'}>
              <Map
                mapboxAccessToken={
                  'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
                }
                mapStyle={`mapbox://styles/mapbox/${mapTheme}`}
                style={{ width: 500, height: 600 }}
                initialViewState={{
                  latitude: centerMapViewState.latitude,
                  longitude: centerMapViewState.longitude,
                  zoom: 12,
                }}
                onClick={(event) => {
                  console.log('event', event);
                  setNewMarker({
                    ...newMarker,
                    coordinates: [event.lngLat.lat, event.lngLat.lng],
                    isVisible: true,
                    event,
                  });
                }}
              >
                <NavigationControl />
                {newMarker.coordinates && (
                  <Marker
                    latitude={newMarker.coordinates[0]}
                    longitude={newMarker.coordinates[1]}
                  >
                    {newMarker.icon}
                  </Marker>
                )}

                {markers.pins.map((pin, index) => {
                  return (
                    <CustomMapMarker key={`pin-marker-${index}`} post={pin} />
                  );
                })}
              </Map>
            </div>
            {/* POPUPS */}
            <div
              className={
                'flex flex-col gap-3 items-center justify-start font-light rounded w-full px-4 py-3 border bg-neutral-50]'
              }
            >
              <div className={'create-event-form-title'}>
                Select Marker Type
              </div>
              <div className={'flex flex-row items-center gap-6 w-full'}>
                <Select
                  onValueChange={(value: string) => {
                    setSelectedMarkerType(value as MarkerType);
                  }}
                >
                  <SelectTrigger className={'w-1/3 text-base'}>
                    <SelectValue placeholder={'...'} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value={'pin'}>Pin</SelectItem>
                      <SelectItem value={'plan'}>Plan</SelectItem>
                      <SelectItem value={'route'}>Route</SelectItem>
                      <SelectItem value={'area'}>Area</SelectItem>
                      <SelectItem value={'structure'}>Structure</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <div
                  className={'leading-[1.1] w-full w-2/3 text-sm'}
                >
                  {selectedMarkerType
                    ? MarkerTypeInstructions[selectedMarkerType]
                    : 'Select a marker type to add to the map.'}
                </div>
              </div>
              <Separator className='' />
             {/* Popup container */}
              <div className={'flex flex-col h-[474px] w-full items-center justify-center'}>
                {!selectedMarkerType && (
                  <Smile className={''} />
                )}
                {selectedMarkerType === 'pin' && (
                  <PinPopup
                    lastClickEvent={newMarker.event}
                    user={user}
                    setMarkerIcon={setMarkerIcon}
                    getAndSetMapMarkers={getAndSetMapMarkers}
                  />
                )}
                {selectedMarkerType === 'plan' && <PlanPopup />}
                {selectedMarkerType === 'route' && <RoutePopup />}
                {selectedMarkerType === 'area' && <AreaPopup />}
                {selectedMarkerType === 'structure' && <StructurePopup />}
              </div>
            </div>
          </div>
          {/* MARKER TABLES */}
          {/* <div className={'w-full border'}>
            <div className={'create-event-form-title'}>Your app's markers</div>
            <ToggleGroup defaultValue={'pins'} variant={'outline'} type='single'>
              <ToggleGroupItem value='pins'>Pins</ToggleGroupItem>
              <ToggleGroupItem value='plans'>Plans</ToggleGroupItem>
              <ToggleGroupItem value='routes'>Routes</ToggleGroupItem>
              <ToggleGroupItem value='areas'>Areas</ToggleGroupItem>
              <ToggleGroupItem value='structures'>Structures</ToggleGroupItem>
            </ToggleGroup>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default AddMarkersMap;
