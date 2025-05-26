'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Button } from '../ui/button';
import {
  Battery,
  ChevronDown,
  Cog,
  Ellipsis,
  Flag,
  Home,
  MapIcon,
  MapPin,
  Search,
  Send,
  Signal,
  Target,
  User,
  ZoomIn,
  ZoomOut,
  Milestone,
  FlagTriangleRight,
  X,
} from 'lucide-react';
import { Map, ViewStateChangeEvent, Marker } from 'react-map-gl/mapbox';
import { Input } from '../ui/input';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog';
import { Slider } from '@/components/ui/slider';
import { Separator } from '../ui/separator';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Label } from '../ui/label';
import { appendMutableCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';
import { range } from 'lodash';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { getPanelElement } from 'react-resizable-panels';
import MockupTopBar from '../pages/TopBar';
import MockupBottomNav from '../pages/BottomNav';
import MockupMapSearchContainer from '../pages/MapSearchContainer';
import { MapLabel } from 'mgtypes/types/Content';
import ColorPicker from './ColorPicker';
import { MapMouseEvent } from 'mapbox-gl';
import Link from 'next/link';
import { Badge } from '../ui/badge';
import Icon from '@mdi/react';
import * as Icons from '@mdi/js';

const LabelMarker: React.FC<{ label: MapLabel }> = ({ label }) => {
  const [iconPath, setIconPath] = useState<string>('')

  useEffect(()=> {
    setIconPath(
      // Icons[label.icon as keyof {[key:string]:string} ?? TODO: figure out getting icons on map
      'mdiMapMarker'
    // ]
  )
  }, [])

  console.log(iconPath)
  return (
    <Marker longitude={label.longitude} latitude={label.latitude}>
      <div>
        <Icon path={iconPath} size={1} />
        {label.title}
      </div>
    </Marker>
  );
};

const MapLabelsMaker: React.FC<{}> = ({}) => {
  const {
    appDetails,
    setAppDetails,
    mapLabels,
    addMapLabel,
    setZoomThresholds,
    appColors,
  } = useCreateAppStore((state) => state);

  const [displayedMapViewState, setDisplayedMapViewState] = useState<{
    latitude: number | undefined;
    longitude: number | undefined;
    zoom: number;
  }>({
    latitude: undefined,
    longitude: undefined,
    zoom: 16,
  });

  const handleDrag = (e: ViewStateChangeEvent) => {
    setDisplayedMapViewState(e.viewState);
    setAppDetails({
      ...appDetails,
      'Event latitude': e.viewState.latitude,
      'Event longitude': e.viewState.longitude,
    });
  };

  useEffect(() => {
    setDisplayedMapViewState({
      ...displayedMapViewState,
      latitude: appDetails['Event latitude'] as number,
      longitude: appDetails['Event longitude'] as number,
    });
  }, [appDetails['Event latitude'], appDetails['Event longitude']]);

  const setThresholdsFromLayout = (sizes: number[]) => {
    console.log('sizes', sizes);

    const satThreshold = (sizes[0] * 22) / 100;
    const crowThreshold = ((sizes[0] + sizes[1]) * 22) / 100;

    setZoomThresholds([crowThreshold, satThreshold]);
  };

  const [isInAddLabelMode, setIsInAddLabelMode] = useState<boolean>(false);

  const [label, setLabel] = useState<Partial<MapLabel>>({});

  const handleTextInput = (e: any) => {
    const { value, name } = e.target;
    console.log('e.target', e.target.value, e.target.name);
    setLabel({ ...label, [name]: value });
  };

  const initAddLabel = (e: MapMouseEvent) => {
    console.log(e);
    setLabel({ ...label, latitude: e.lngLat.lat, longitude: e.lngLat.lng });
    setIsInAddLabelMode(true);
  };

  const handleAddLabel = () => {
    // TODO:
  };

  return (
    <div className={'flex flex-row items-center gap-8 justify-center'}>
      {/* LEFT SIDE: ZOOM TOOLS */}
      <div className={'flex flex-col w-80 gap-6 items-center'}>
        {/* MAP CENTER */}
        <div
          className={
            'flex w-full flex-col border bg-neutral-100 px-2 py-1 rounded'
          }
        >
          <div className={'flex flex-row items-center gap-2 font-mono'}>
            <Target size={20} color={'orange'} />
            <div>Map center</div>
          </div>

          <div className={'flex flex-row justify-between w-full'}>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Lat:&nbsp;</span>
              {appDetails['Event latitude'] &&
                appDetails['Event latitude'].toFixed(4)}
            </div>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Lng:&nbsp;</span>
              {appDetails['Event longitude'] &&
                appDetails['Event longitude'].toFixed(4)}
            </div>
          </div>
        </div>
        {/* ZOOM HEIGHTS PROFILE */}
        <div className={'flex flex-row gap-4 justify-center w-full'}>
          <div
            className={
              'relative flex flex-col items-end justify-end max-h-[580px] border-2 w-full'
            }
          >
            {/* PANELS */}
            <ResizablePanelGroup
              direction='vertical'
              onLayout={(sizes) => {
                setThresholdsFromLayout(sizes);
              }}
              className={'w-full'}
            >
              <ResizablePanel
                id={'satellite'}
                className={'flex flex-col justify-end items-center'}
              >
                <div className={'text-sm font-mono mb-2'}>
                  Satellite: {mapLabels.zoomThresholds[1].toFixed(2)}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                id={'crow'}
                className={'flex flex-col justify-end items-center'}
              >
                <div className={'text-sm font-mono mb-2'}>
                  Crow: {mapLabels.zoomThresholds[0].toFixed(2)}
                </div>
              </ResizablePanel>
              <ResizableHandle withHandle />
              <ResizablePanel
                className={
                  'flex font-mono text-sm flex-col justify-end items-center'
                }
                id={'ground'}
              >
                Ground
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
          {/* SCALE */}
          <div className={'flex flex-row h-full gap-2'}>
            <div className={'flex flex-col text-right py-[3px]'}>
              {range(23).map((number) => (
                <div
                  key={`zoom-graph-y-axis-${number}`}
                  className={'text-xs font-mono'}
                >
                  {number}
                </div>
              ))}
            </div>

            {/* SLIDERS */}
            <div className={'flex flex-col'}>
              <Slider
                orientation='vertical'
                value={[displayedMapViewState?.zoom as number]}
                onValueChange={(e) => {
                  setDisplayedMapViewState({
                    ...displayedMapViewState,
                    zoom: Math.round(e[0] * 4) / 4, // rounds to nearest 1/4
                  });
                }}
                min={0}
                max={22}
                step={0.25}
                inverted={true}
                disabled={isInAddLabelMode}
              />
            </div>
          </div>
        </div>
        {/* ZOOM */}
        <div className={'flex justify-end w-full font-mono'}>
          <div className={'flex flex-row'}>
            <span className={'font-bold'}>Zoom:&nbsp;</span>
            {displayedMapViewState.zoom}
          </div>
        </div>
      </div>
      {/* MAP */}
      <div className='flex flex-col items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] w-[276px] h-[572px]'>
        {/* FAKE TOP BAR */}
        <MockupTopBar />

        {/* MAP CONTAINER */}
        <div className={'flex grow relative'}>
          <MockupMapSearchContainer colors={appColors} />
          <div
            className={
              'flex absolute z-50 bottom-1 border bg-neutral-50 py-1 px-2 rounded left-1 font-mono'
            }
          >
            Zoom level:
            {displayedMapViewState.zoom < mapLabels.zoomThresholds[1]
              ? 'Satellite'
              : displayedMapViewState.zoom > mapLabels.zoomThresholds[0]
                ? 'Ground'
                : 'Crow'}
          </div>

          {displayedMapViewState?.latitude &&
            displayedMapViewState.longitude && (
              <Map
                id={'centerMap'}
                mapboxAccessToken={
                  'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
                }
                mapStyle='mapbox://styles/mapbox/light-v11'
                initialViewState={{
                  longitude: -100,
                  latitude: 40,
                  zoom: 13,
                }}
                style={{ width: 268, height: 460 }}
                onDrag={handleDrag}
                {...displayedMapViewState}
                onClick={initAddLabel}
              >
                {/* MAP CENTER */}
                <Marker
                  longitude={appDetails['Event longitude'] as number}
                  latitude={appDetails['Event latitude'] as number}
                >
                  <Target size={20} color={'orange'} />
                </Marker>

                {/* NEW LABEL */}
                {isInAddLabelMode && (
                  <Marker
                    longitude={label.longitude ?? 0}
                    latitude={label.latitude ?? 0}
                  >
                    <X color={'red'} />
                  </Marker>
                )}

                {/* SATELLITE LABELS */}
                {displayedMapViewState.zoom < mapLabels.zoomThresholds[1] &&
                  mapLabels.labels[1].map(
                    (satelliteLabel: MapLabel, index: number) => {
                      return (
                        <LabelMarker
                          key={`sat-label-marker-${index}`}
                          label={satelliteLabel}
                        />
                      );
                    }
                  )}

                {/* CROW LABELS */}
                {displayedMapViewState.zoom > mapLabels.zoomThresholds[1] &&
                  displayedMapViewState.zoom < mapLabels.zoomThresholds[0] &&
                  mapLabels.labels[0].map(
                    (crowLabel: MapLabel, index: number) => {
                      return (
                        <LabelMarker
                          key={`crow-label-marker-${index}`}
                          label={crowLabel}
                        />
                      );
                    }
                  )}
              </Map>
            )}
        </div>

        {/* BOTTOM NAV */}
        <MockupBottomNav colors={appColors} page={'map'} />
      </div>
      {/* RIGHT SIDE: CREATE LABEL FORM */}
      <div className={'flex w-56 border bg-neutral-100 px-2 py-1'}>
        {isInAddLabelMode ? (
          <div className={'flex flex-col gap-2'}>
            <div className='flex flex-row items-center gap-2'>
              <X color={'red'} />
              <div className={'font-mono'}>New label</div>
            </div>
            <div>
              Zoom level:{' '}
              {displayedMapViewState.zoom < mapLabels.zoomThresholds[1]
                ? 'Satellite'
                : displayedMapViewState.zoom > mapLabels.zoomThresholds[0]
                  ? 'Ground'
                  : 'Crow'}
            </div>
            <div>
              <div>
                <span className={'font-bold'}>Lat: </span>
                {label.latitude?.toFixed(3)}
              </div>
              <div>
                <span className={'font-bold'}>Lng: </span>
                {label.longitude?.toFixed(3)}
              </div>
            </div>
            <div>
              <Label>Title</Label>
              <Input
                name={'title'}
                onChange={(e) => handleTextInput(e)}
                disabled={!isInAddLabelMode}
              />
            </div>
            <div>
              <div className={'flex w-full justify-between items-center mb-1'}>
                <Label>Icon</Label>
                <Link
                  target='_blank'
                  href={'https://pictogrammers.com/library/mdi/'}
                >
                  <Badge>Search icons</Badge>
                </Link>
              </div>
              <Input name={'icon'} disabled={!isInAddLabelMode} />
            </div>
            <div>
              <Label></Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant={'outline'} disabled={!isInAddLabelMode}>
                    {label.iconColor ? (
                      <div className={'flex items-center gap-2'}>
                        <div
                          className={'w-6 h-6 rounded'}
                          style={{ backgroundColor: label.iconColor as string }}
                        />
                        {label.iconColor}
                      </div>
                    ) : (
                      <div>Select icon color</div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={'flex w-[650px]'} align='end'>
                  <ColorPicker
                    onChangeComplete={(colorResult, event) => {
                      setLabel({ ...label, iconColor: colorResult.hex });
                    }}
                    initialColor='#7e22ce'
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Button>Add label</Button>
          </div>
        ) : (
          <div>Click the map where you'd like to add a label</div>
        )}
      </div>
    </div>
  );
};

export default MapLabelsMaker;
