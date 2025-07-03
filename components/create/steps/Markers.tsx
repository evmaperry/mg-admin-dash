'use client';
import React, { useEffect, useRef, useState } from 'react';
import {
  Layer,
  Map,
  MapMouseEvent,
  Marker,
  NavigationControl,
  Popup,
  Source,
} from 'react-map-gl/mapbox';
import { useCreateAppStore } from '@/providers/create-app-provider';
import PinPopup from '../popups/PinPopup';
import PlanPopup from '../popups/PlanPopup';
import RoutePopup from '../popups/RoutePopup';
import AreaPopup from '../popups/AreaPopup';
import StructurePopup from '../popups/StructurePopup';
import {
  ArrowLeft,
  ArrowUpLeft,
  CircleX,
  Crosshair,
  Sparkles,
} from 'lucide-react';
import { FeatureCollection, Position } from 'geojson';
import { User } from '@supabase/supabase-js';
import { getMapMarkersFromDb } from '../createActions';
import MapPointMarker from '../popups/MapPointMarker';
import { Separator } from '../../ui/separator';
import 'mapbox-gl/dist/mapbox-gl.css';
import { convertMapThemeToStyleURL } from '@/utils/mapbox/utils';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import MapRouteMarker from '../popups/MapRouteMarker';
import {
  CircleLayerSpecification,
  FillLayer,
  FillLayerSpecification,
  MapLayerMouseEvent,
} from 'mapbox-gl';
import MapMarkerTable from '../MapMarkerTable';
import { Label } from '@/components/ui/label';
import { useSidebar } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const Markers: React.FC<{ user: User }> = ({ user }) => {
  const { open, state } = useSidebar();

  const {
    mapTheme,
    markers,
    setMarkers,
    appDetails,
    addCoordinate,
    selectedMarkerType,
    setSelectedMarkerType,
  } = useCreateAppStore((state) => state);

  const MarkerTypeInstructions = {
    pin: 'Pins indicate the location of services and points of interest: bathrooms, vendors, emergency services, and so on. A pin can have hours of operations.',
    plan: 'Plans indicate the location of an event that start and end at fixed times. Your guests can RSVP to plans and share them with their connections in the app.',
    route:
      'Routes include parades and races and illustrate a path that will be traveled by event guests, competitors, or the like. Routes have start and end times.',
    area: 'Areas subdivide your event footprint into colored zones on the map. They can represent anything: pavilions and expos, athletic fields and courts, food and beverage services, camp sites, performance or VIP areas, and so on.',
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

  const setPointMarkerIcon = (category: string, type: string) => {
    if (selectedMarkerType === 'pin' || selectedMarkerType === 'plan') {
      setNewPointMarker({
        ...newPointMarker,
        type,
        category,
      });
    }
  };

  // represents a new multi-coordinate marker being drawn
  // eg, route, area or structure
  // has to have all the properties of these marker types
  // to be able to pass properties to both the map
  // and the panel
  const [newMultiMarker, setNewMultiMarker] = useState<{
    category: string | undefined;
    coordinates: Position[]; // all have coordinates
    event: null | MapMouseEvent;
    color: string | undefined;
    primaryText: string | undefined;
    secondaryText: string | undefined;
    link: string | undefined;
    phoneNumber: string | undefined;
  }>({
    category: undefined,
    coordinates: [],
    event: null,
    color: '#123123',
    primaryText: undefined,
    secondaryText: undefined,
    link: undefined,
    phoneNumber: undefined,
  });

  // const setMultiMarkerIcon = (category: string) => {
  //   setNewMultiMarker({
  //     ...newMultiMarker,
  //     category,
  //   });
  // };

  /**
   * Used to refresh markers after something has been added.
   * Gets passed down to each [marker type]Popup
   */
  const getAndSetMapMarkers = async () => {
    try {
      const markers = await getMapMarkersFromDb(1);
      setMarkers(markers);
    } catch (e) {
      console.error('ADDMARKERMAP ERROR: failed to get and set markers', e);
    }
  };

  const handleMapClick = (event: MapMouseEvent) => {
    // console.log('singleClickEvent', event, event.features);

    if (selectedMarkerType === 'route') {
      console.log('hittin');
      const coordinate: Position = [event.lngLat.lng, event.lngLat.lat];

      // add a turn to a pre-existing route
      if (event.features && event.features.length > 0) {
        const [markerType, id, shape, index] =
          event.features?.[0].layer?.id.split('-') as string[];

        addCoordinate(
          markerType as 'route' | 'area' | 'structure',
          Number(id),
          Number(index),
          coordinate
        );
      }

      // create a new route
      else {
        setNewMultiMarker({
          ...newMultiMarker,
          event,
          coordinates: newMultiMarker.coordinates.concat([coordinate]),
        });
      }
    }

    if (selectedMarkerType === 'pin' || selectedMarkerType === 'plan') {
      setNewPointMarker({
        ...newPointMarker,
        coordinates: [event.lngLat.lat, event.lngLat.lng],
        isVisible: true,
        event,
      });
    }
  };

  const handleMapDblClick = (event: MapMouseEvent) => {
    console.log('Double click event:', event);
  };

  const interactiveRouteIds = Object.values(markers.routes).reduce(
    (acc: any[], cur: any, index: number, array: any[]) => {
      return acc.concat(
        cur.coordinates.map((coord: Position, coordIndex: number) => {
          return `route-${cur.id}-line-${coordIndex + 1}-layer`;
        })
      );
    },
    []
  );

  console.log('reRendering Markers. newMultiMarker', newMultiMarker);

  return (
    <div>
      <div className={'create-app-form-container'}>
        {/* TITLE / INSTRUCTIONS */}
        <div className={'flex gap-4 items-center'}>
          {/* <div className={'flex flex-col items-center gap-2 w-72'}>
            <div className={'create-app-form-title'}>Map Markers</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button size={'sm'} variant={'outline'}>
                  <Info className={'mr-1'} /> Instructions
                </Button>
              </PopoverTrigger>
              <PopoverContent className={'leading-[1.2] font-light w-[600px]'}>
                <div>
                  The map displays different content depending on how zoomed in
                  the view is. When the map is relatively zoomed in, the user
                  sees pins, routes and plans. When the map is relatively zoomed
                  out, the user sees labels, which locate the event within a
                  wider geographic context and help to section off the areas of
                  your event.
                </div>
                <div>
                  Click and drag the map to re-center your event in the frame of
                  the phone to best display the boundaries of your event.
                </div>
              </PopoverContent>
            </Popover>
          </div> */}

          <div className={'create-app-form-subcontainer flex-row w-full gap-8'}>
            <div className={'flex flex-col gap-3 pt-1'}>
              <Label className='text-center'>
                Select a marker type to add to your map
              </Label>
              <ToggleGroup
                variant={'marker'}
                type={'single'}
                onValueChange={(value: string) => {
                  setSelectedMarkerType(
                    value as
                      | 'pin'
                      | 'plan'
                      | 'route'
                      | 'area'
                      | 'structure'
                      | 'null'
                  );
                }}
                className={'font-mono'}
                value={
                  selectedMarkerType === null ? undefined : selectedMarkerType
                }
              >
                <ToggleGroupItem
                  value={'pin'}
                  className={
                    'data-[state=on]:bg-indigo-600 data-[state=off]:text-indigo-600 data-[state=off]:border-indigo-600'
                  }
                >
                  Pin
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={'plan'}
                  className={
                    'data-[state=on]:bg-sky-400 data-[state=off]:text-sky-400 data-[state=off]:border-sky-400'
                  }
                >
                  Plan
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={'route'}
                  className={
                    'data-[state=on]:bg-teal-400 data-[state=off]:text-teal-400 data-[state=off]:border-teal-400'
                  }
                >
                  Route
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={'area'}
                  className={
                    'data-[state=on]:bg-red-400 data-[state=off]:text-red-400 data-[state=off]:border-red-400'
                  }
                >
                  Area
                </ToggleGroupItem>
                <ToggleGroupItem
                  value={'structure'}
                  className={
                    'data-[state=on]:bg-fuchsia-400 data-[state=off]:text-fuchsia-400 data-[state=off]:border-fuchsia-400'
                  }
                >
                  Structure
                </ToggleGroupItem>
                {/* <ToggleGroupItem value={'null'}>Null</ToggleGroupItem> */}
              </ToggleGroup>
            </div>
            <div
              className={
                'text-xs leading-[1.1] flex shrink items-center justify-center w-full font-mono'
              }
            >
              {selectedMarkerType ? (
                <div
                  className={
                    'text-ellipsis overflow-hidden line-clamp-3 max-w-[650px]'
                  }
                >
                  {MarkerTypeInstructions[selectedMarkerType]}
                </div>
              ) : (
                <div className={'flex items-center gap-2'}>
                  {' '}
                  <ArrowLeft size={32} />
                  <div>
                    Select a marker type to add to the map. You'll see helpful
                    hints display here when you pick one.
                  </div>{' '}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* EVERYTHING ELSE */}

        {/* TODO: figure out how to get map to refresh on sidebar toggle */}

        <div className={'flex flex-row gap-2'} style={{}}>
          {/* MAP */}
          <div
            className={cn(
              'flex h-[500px] overflow-auto',
              state === 'expanded' ? 'w-[calc(100dvw-763px)]' : 'w-full'
            )}
          >
            {appDetails['Event latitude'] && appDetails['Event longitude'] && (
              <Map
                mapboxAccessToken={
                  'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
                }
                mapStyle={convertMapThemeToStyleURL(mapTheme)}
                style={{ width: 2000, height: 501 }}
                initialViewState={{
                  longitude: appDetails['Event longitude'],
                  latitude: appDetails['Event latitude'],
                  zoom: 14,
                }}
                onClick={handleMapClick}
                onDblClick={handleMapDblClick}
                interactiveLayerIds={interactiveRouteIds}
                doubleClickZoom={false}
              >
                <NavigationControl />

                {newPointMarker.coordinates &&
                  (selectedMarkerType === 'pin' ||
                    selectedMarkerType === 'plan') && (
                    <MapPointMarker
                      post={{
                        latitude: newPointMarker.coordinates[0],
                        longitude: newPointMarker.coordinates[1],
                        pinCategory:
                          selectedMarkerType === 'pin' &&
                          newPointMarker.category
                            ? newPointMarker.category
                            : undefined,
                        pinType:
                          selectedMarkerType === 'pin' && newPointMarker.type
                            ? newPointMarker.type
                            : undefined,
                        planCategory:
                          selectedMarkerType === 'plan' &&
                          newPointMarker.category
                            ? newPointMarker.category
                            : undefined,
                        planType:
                          selectedMarkerType === 'plan' && newPointMarker.type
                            ? newPointMarker.type
                            : undefined,
                      }}
                    />
                  )}

                {selectedMarkerType === 'route' &&
                  newMultiMarker.coordinates.length > 0 && (
                    <MapRouteMarker
                      post={{
                        coordinates: newMultiMarker.coordinates,
                        routeCategory: newMultiMarker.category
                          ? newMultiMarker.category
                          : undefined,
                        color: newMultiMarker.color as string,
                      }}
                    />
                  )}

                {markers.pins &&
                  Object.values(markers.pins).map((pin, index) => {
                    return (
                      <MapPointMarker
                        key={`pin-marker-${index}`}
                        post={pin}
                        contentType={'pin'}
                      />
                    );
                  })}
                {markers.plans &&
                  Object.values(markers.plans).map((plan, index) => {
                    return (
                      <MapPointMarker
                        key={`plan-marker-${index}`}
                        post={plan}
                        contentType={'plan'}
                      />
                    );
                  })}

                {/* {markers.routes &&
                  Object.values(markers.routes).map((route, index) => {
                    return (
                      <MapRouteMarker
                        key={`route-marker-${index}`}
                        post={route}
                      />
                    );
                  })} */}
              </Map>
            )}
          </div>

          {/* POPUPS */}
          <div
            className={
              ' create-app-form-subcontainer items-center justify-center font-light tracking-tight w-[435px]'
            }
          >
            {!selectedMarkerType && (
              <div className={'flex flex-col h-full w-full'}>
                <div className={'create-app-form-subtitle'}>
                  MARKER TYPE:{' '}
                  <span className={'text-red-600 font-bold'}>NOT SELECTED</span>
                </div>
                <Separator />
                <div
                  className={'flex gap-4 h-full items-center justify-center'}
                >
                  <ArrowUpLeft size={64} />
                  <div className={'w-64'}>
                    Select a marker type to add to the map. You'll see an input
                    form display here after selecting one.
                  </div>
                </div>
              </div>
            )}
            {selectedMarkerType === 'pin' && (
              <PinPopup
                lastClickEvent={newPointMarker.event}
                user={user}
                setPinMarkerIcon={setPointMarkerIcon}
                getAndSetMapMarkers={getAndSetMapMarkers}
              />
            )}
            {selectedMarkerType === 'plan' && (
              <PlanPopup
                lastClickEvent={newPointMarker.event}
                user={user}
                setPlanMarkerIcon={setPointMarkerIcon}
                getAndSetMapMarkers={getAndSetMapMarkers}
              />
            )}
            {selectedMarkerType === 'route' && (
              <RoutePopup
                lastClickEvent={newMultiMarker.event}
                multiMarkerBundle={{ setNewMultiMarker, newMultiMarker }} // needed for changing color of new route
                user={user}
                getAndSetMapMarkers={getAndSetMapMarkers}
              />
            )}
            {selectedMarkerType === 'area' && <AreaPopup />}
            {selectedMarkerType === 'structure' && <StructurePopup />}
          </div>
        </div>

        {/*
        <MapMarkerTable /> */}
      </div>
    </div>
  );
};

export default Markers;
