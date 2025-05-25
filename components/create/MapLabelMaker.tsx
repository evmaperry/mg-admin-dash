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
} from 'lucide-react';
import { Map, ViewStateChangeEvent } from 'react-map-gl/mapbox';
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

  const handleMove = (e: ViewStateChangeEvent) => {
    setDisplayedMapViewState(e.viewState);
    setAppDetails({
      ...appDetails,
      'Event latitude': e.viewState.latitude,
      'Event longitude': e.viewState.longitude,
    });
  };

  useEffect(() => {
    setDisplayedMapViewState({
      zoom: 12,
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

  return (
    <div className={'flex flex-row items-center gap-8 justify-center'}>
      <div className={'flex flex-col gap-2 w-[580px] items-center'}>
        <div className={'flex flex-col gap-2 w-96'}>
          {/*  INSTRUCTIONS */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className={'mx-auto'}>Instructions</Button>
            </PopoverTrigger>
            <PopoverContent className={'leading-[1.3]'}>
              <div>
                The map displays different content depending on how zoomed in
                the view is. When the map is relatively zoomed in, the user sees
                pins, routes and plans. When the map is relatively zoomed out,
                the user sees labels, which locate the event within a wider
                geographic context and help to section off the areas of your
                event.
              </div>
            </PopoverContent>
          </Popover>
          <div className={'flex flex-row gap-4 justify-center w-full'}>
            <div
              className={
                'relative flex flex-col items-end justify-end max-h-[580px] border-2 w-full'
              }
            >
              <ResizablePanelGroup
                direction='vertical'
                onLayout={(sizes) => {
                  setThresholdsFromLayout(sizes);
                }}
                className={'w-full'}
              >
                <ResizablePanel
                  id={'satellite'}
                  defaultSize={25}
                  className={'flex flex-col justify-center items-center'}
                >
                  <div className={'flex grow items-center'}>Satellite</div>
                  <div className={'text-sm font-mono'}>
                    {mapLabels.zoomThresholds[1]}
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                  id={'crow'}
                  defaultSize={25}
                  className={'flex flex-col justify-center items-center'}
                >
                  <div className={'flex grow items-center'}>Crow</div>
                  <div className={'text-sm font-mono'}>
                    {mapLabels.zoomThresholds[0]}
                  </div>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel
                  className={'flex flex-col justify-center items-center'}
                  id={'ground'}
                >
                  Ground
                </ResizablePanel>
              </ResizablePanelGroup>
            </div>
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
                />
              </div>
            </div>
          </div>

          <div className={'flex justify-end w-full font-mono'}>
            Zoom: {displayedMapViewState.zoom}
          </div>
        </div>

        {/* CONTROLS */}
        <div className={'flex flex-row items-center gap-1 justify-between'}>
          <div className={'flex flex-col w-full'}>
            <div className='font-mono create-event-form-title'>
              Center your map
            </div>
            <div className={'leading-[1.3]'}>
              Click and drag the map to re-center your event in the frame of the
              phone to best display the boundaries of your event.
            </div>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Latitude:&nbsp;</span>
              {appDetails['Event latitude'] &&
                appDetails['Event latitude'].toFixed(3)}
            </div>

            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Longitude:&nbsp;</span>
              {appDetails['Event longitude'] &&
                appDetails['Event longitude'].toFixed(3)}
            </div>
          </div>
        </div>
      </div>
      {/* MAP */}
      <div className='flex flex-col items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] w-[276px] h-[572px]'>
        {/* FAKE TOP BAR */}
        <MockupTopBar />

        {/* MAP CONTAINER */}
        <div className={'flex grow relative justify-center items-center'}>
          <MockupMapSearchContainer colors={appColors} />
          <div className={'flex justify-center z-40 w-full absolute'}>
            <Target size={20} color={'orange'} />
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
                onDrag={handleMove}
                {...displayedMapViewState}
              />
            )}
        </div>

        {/* BOTTOM NAV */}
        <MockupBottomNav colors={appColors} page={'map'} />
      </div>
    </div>
  );
};

export default MapLabelsMaker;
