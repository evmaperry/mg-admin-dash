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
import MapPointMarker from './popups/MapPointMarker';
import { Separator } from '../ui/separator';
import 'mapbox-gl/dist/mapbox-gl.css';
import { convertMapThemeToStyleURL } from '@/utils/mapbox/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MapRouteMarker from './popups/MapRouteMarker';

type MarkerType = 'pin' | 'plan' | 'route' | 'area' | 'structure' | null;

const AddMarkersMap: React.FC<{ user: User }> = ({ user }) => {
  const { mapTheme, markers, setMarkers, appDetails } = useCreateAppStore(
    (state) => state
  );

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

  // represents a new pin or plan being worked on
  const [newPointMarker, setNewPointMarker] = useState<{
    isVisible: boolean;
    coordinates: Position | null;
    event: null | MapMouseEvent;
    icon: React.ReactElement;
    type: string | null;
    category: string | null;
  }>({
    isVisible: false,
    coordinates: null,
    event: null,
    icon: <Crosshair />,
    type: null,
    category: null,
  });

  const setMarkerIcon = (category: string, type: string) => {
    console.log('set marker');

    if (selectedMarkerType === 'pin' || selectedMarkerType === 'plan') {
      setNewPointMarker({
        ...newPointMarker,
        type,
        category,
      });
    }
  };

  const getAndSetMapMarkers = async () => {
    try {
      const markers = await getMapMarkersFromDb(1);
      setMarkers(markers);
    } catch (e) {
      console.error('ADDMARKERMAP ERROR: failed to get and set markers', e);
    }
  };

  const handleMapClick = (event: MapMouseEvent) => {
    if (selectedMarkerType === 'pin' || selectedMarkerType === 'plan') {
      setNewPointMarker({
        ...newPointMarker,
        coordinates: [event.lngLat.lat, event.lngLat.lng],
        isVisible: true,
        event,
      });
    }

    if (selectedMarkerType === 'route') {
    }
  };

  console.log('markers', markers)
  return (
    <div className={'flex flex-col gap-3 w-full'}>
      <div className={'flex flex-row h-20 items-center gap-3 w-full'}>
        <div className={'flex w-1/5 text-sky-500 font-mono'}>
          Select a marker type 👉
        </div>
        <ToggleGroup
          onValueChange={(value: string) => {
            setSelectedMarkerType(value as MarkerType);
          }}
          type={'single'}
          className={'flex w-2/5'}
          variant={'outline'}
        >
          <ToggleGroupItem value={'pin'}>Pin</ToggleGroupItem>
          <ToggleGroupItem value={'plan'}>Plan</ToggleGroupItem>
          <ToggleGroupItem value={'route'}>Route</ToggleGroupItem>
          <ToggleGroupItem value={'area'}>Area</ToggleGroupItem>
          <ToggleGroupItem value={'structure'}>Structure</ToggleGroupItem>
        </ToggleGroup>
        <div
          className={
            'leading-[1.1] h-full flex items-center w-2/5 text-xs border bg-neutral-100 p-2 rounded font-mono'
          }
        >
          {selectedMarkerType
            ? MarkerTypeInstructions[selectedMarkerType]
            : 'Select a marker type to add to the map.'}
        </div>
      </div>
      <div className={'flex flex-col items-center w-full gap-4'}>
        <div className={'flex flex-row w-full justify-between gap-3'}>
          {/* MAP */}
          <div className={'flex rounded overflow-hidden h-[600px] w-2/3'}>
            {appDetails['Event latitude'] && appDetails['Event longitude'] && (
              <Map
                mapboxAccessToken={
                  'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
                }
                mapStyle={convertMapThemeToStyleURL(mapTheme)}
                style={{ width: 2000, height: 600 }}
                initialViewState={{
                  longitude: appDetails['Event longitude'],
                  latitude: appDetails['Event latitude'],
                  zoom: 14,
                }}
                onClick={(event: MapMouseEvent) => {
                  handleMapClick(event);
                }}
              >
                <NavigationControl />
                {newPointMarker.coordinates && (
                  <MapPointMarker
                    post={{
                      latitude: newPointMarker.coordinates[0],
                      longitude: newPointMarker.coordinates[1],
                      pinCategory:
                        selectedMarkerType === 'pin' && newPointMarker.category
                          ? newPointMarker.category
                          : undefined,
                      pinType:
                        selectedMarkerType === 'pin' && newPointMarker.type
                          ? newPointMarker.type
                          : undefined,
                      planCategory:
                        selectedMarkerType === 'plan' && newPointMarker.category
                          ? newPointMarker.category
                          : undefined,
                      planType:
                        selectedMarkerType === 'plan' && newPointMarker.type
                          ? newPointMarker.type
                          : undefined,
                    }}
                  />
                )}

                {/* MARKERS FROM STORE */}
                {markers.pins.map((pin, index) => {
                  return (
                    <MapPointMarker key={`pin-marker-${index}`} post={pin} />
                  );
                })}
                {markers.plans.map((plan, index) => {
                  return (
                    <MapPointMarker key={`plan-marker-${index}`} post={plan} />
                  );
                })}

                {markers.routes.map((route, index) => {
                  return <MapRouteMarker key={`route-marker-${index}`} post={route} />;
                })}
              </Map>
            )}
          </div>
          {/* POPUPS */}
          <div
            className={
              'flex flex-col gap-3 items-center justify-start font-light rounded w-1/3 px-4 py-3 border bg-neutral-50]'
            }
          >
            {/* Popup container */}
            {!selectedMarkerType && <Smile className={''} />}
            {selectedMarkerType === 'pin' && (
              <PinPopup
                lastClickEvent={newPointMarker.event}
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
    </div>
  );
};

export default AddMarkersMap;
