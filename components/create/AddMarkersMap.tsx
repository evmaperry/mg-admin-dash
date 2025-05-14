import React, { useState } from 'react';
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
import { Crosshair } from 'lucide-react';
import { Position } from 'geojson';

type MarkerType = 'pin' | 'plan' | 'route' | 'area' | 'structure' | null;

const AddMarkersMap: React.FC<{}> = ({}) => {
  const { mapTheme, centerMapViewState } = useCreateAppStore((state) => state);

  const [selectedMarkerType, setSelectedMarkerType] =
    useState<MarkerType>(null);

  const MarkerTypeInstructions = {
    pin: 'Pins indicate the location of a service or point of interest, like a food or drink vendor, bathroom, souvenir tent, etc. A pin can have hours of operations.',
    plan: 'Plans pinpoint the location of an event that happens at a fixed time. Your apps users can RSVP to plans and share them with their friends.',
    route:
      'Routes draw out the path of an event or procession, like a parade or footrace. Routes have start and end times.',
    area: 'Areas divide your event footprint into memorable zones, like the Food Court, Fun Fair, Music Stage, and so on. Areas are color-coordinated. Areas are not interactive and only display on the map.',
    structure:
      'Structures display as three-dimensional shapes on your map, but they are not interactive.',
  };

  const [addMarker, setAddMarker] = useState<{
    isVisible: boolean;
    coordinates: Position | null;
    event: null | MapMouseEvent;
  }>({
    isVisible: false,
    coordinates: null,
    event: null,
  });

  return (
    <div className={'flex w-full'}>
      {centerMapViewState === null ? (
        <div className={'text-center rounded bg-red-200 p-2 w-full'}>
          Center your event above before adding markers and features to the map.
        </div>
      ) : (
        <div className={'flex flex-col items-center w-full gap-6'}>
          <div
            className={
              'flex flex-row items-center w-full p-4 border rounded justify-around bg-neutral-50 gap-2'
            }
          >
            <div className={'w-1/3 flex flex-col gap-2 text-center font-mono'}>
              <div className={'font-bold'}>Select a marker type</div>
              <Select
                onValueChange={(value: string) => {
                  setSelectedMarkerType(value as MarkerType);
                }}
              >
                <SelectTrigger className={''}>
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
            </div>
            <div className={'leading-[1.1] w-1/2 text-center font-light'}>
              {selectedMarkerType
                ? MarkerTypeInstructions[selectedMarkerType]
                : 'Select a marker type to add to the map.'}
            </div>
          </div>
          <div className={'flex flex-row w-full justify-between gap-6'}>
            <Map
              mapboxAccessToken={
                'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
              }
              mapStyle={`mapbox://styles/mapbox/${mapTheme}`}
              style={{ width: 800, height: 460 }}
              initialViewState={{
                latitude: centerMapViewState.latitude,
                longitude: centerMapViewState.longitude,
                zoom: 12,
              }}
              onClick={(event) => {
                console.log('event', event);
                setAddMarker({
                  coordinates: [event.lngLat.lat, event.lngLat.lng],
                  isVisible: true,
                  event,
                });
              }}
            >
              <NavigationControl />
              {addMarker.coordinates && (
                <Marker
                  latitude={addMarker.coordinates[0]}
                  longitude={addMarker.coordinates[1]}
                >
                  <Crosshair />
                </Marker>
              )}
            </Map>
            {/* POPUPS */}
            {!selectedMarkerType && (
              <div
                className={
                  'flex flex-col items-center justify-center font-light w-1/2 p-2 border bg-neutral-50'
                }
              >
                Select a marker type to add to the map.
              </div>
            )}
            {selectedMarkerType === 'pin' && (
              <PinPopup lastClickEvent={addMarker.event} />
            )}
            {selectedMarkerType === 'plan' && <PlanPopup />}
            {selectedMarkerType === 'route' && <RoutePopup />}
            {selectedMarkerType === 'area' && <AreaPopup />}
            {selectedMarkerType === 'structure' && <StructurePopup />}
          </div>
        </div>
      )}
    </div>
  );
};

export default AddMarkersMap;
