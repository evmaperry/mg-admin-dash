'use client';
import React, { useState } from 'react';
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

const MapLabelsMaker: React.FC<{}> = ({}) => {
  const {
    centerMapViewState,
    setCenterMapViewState,
    appDetails,
    setAppDetails,
    mapLabels,
    setMapLabels,
  } = useCreateAppStore((state) => state);

  const [displayedMapViewState, setDisplayedMapViewState] = useState<{
    latitude: number;
    longitude: number;
    zoom: number;
  }>({
    latitude: appDetails['Event latitude']
      ? appDetails['Event latitude']
      : 44.15,
    longitude: appDetails['Event longitude']
      ? appDetails['Event longitude']
      : -85.73,
    zoom: mapLabels.zoomThresholds ? mapLabels.zoomThresholds[0] : 3,
  });

  const handleMove = (e: ViewStateChangeEvent) => {
    setDisplayedMapViewState(e.viewState);
  };

  const saveCenter = () => {
    setCenterMapViewState({
      latitude: displayedMapViewState.latitude,
      longitude: displayedMapViewState.longitude,
      zoom: displayedMapViewState.zoom,
    });
  };

  return (
    <div className={'flex flex-row items-center gap-8 justify-center border'}>
      <div className={'flex flex-col gap-2 w-[580px]'}>
        {/* INSTRUCTIONS */}
        <div className={'flex flex-col gap-2 w-full'}>
          <div>
            On top of pins, plans and routes you can add labels to your map that are visible when the map is relatively zoomed out. There are two zoom thresholds at which the
            visibility of these labels changes:
          </div>
          <div className={'flex flex-col h-24 border'}>
            <div className={'flex flex-row items-center gap-2'}>
              <span className={'font-bold'}>Top level: </span>Event label
              <Flag />
            </div>
            <div className={'flex flex-row items-center gap-2'}>
              <span className={'font-bold'}>Middle level: </span> Area labels
              <Milestone />
            </div>
            <div className={'flex flex-row items-center gap-2'}>
              <span className={'font-bold'}>Bottom level: </span>Pin, plan &
              route labels
              <MapPin />
            </div>
          </div>
        </div>

        {/* CONTROLS */}
        <div className={'flex flex-row items-center gap-1 justify-between'}>
          <div className={'flex flex-col w-full'}>
            <div className='font-mono create-event-form-title'>Map center</div>
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
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Zoom threshold 1:&nbsp;</span>
              {mapLabels.zoomThresholds[0]}
            </div>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Zoom threshold 2:&nbsp;</span>
              {mapLabels.zoomThresholds[1]}
            </div>
          </div>
          {/* Zoom/Save/Close buttons */}
          <div className={'flex gap-2 w-full justify-end'}>
            <Button
              onClick={() => {
                setDisplayedMapViewState({
                  ...displayedMapViewState,
                  zoom: displayedMapViewState.zoom + 1,
                });
              }}
              size={'icon'}
            >
              <ZoomIn />
            </Button>
            <Button
              onClick={() => {
                setDisplayedMapViewState({
                  ...displayedMapViewState,
                  zoom: displayedMapViewState.zoom - 1,
                });
              }}
              size={'icon'}
            >
              <ZoomOut />
            </Button>
            <Button
              onClick={() => {
                saveCenter();
              }}
            >
              Save
            </Button>
          </div>
        </div>
      </div>
      {/* MAP */}
      <div className='flex relative items-center justify-center overflow-hidden border-4 border-neutral-800 shadow rounded-[38px] pt-10 pb-16'>
        <Target className={'z-40 flex absolute'} size={36} color={'orange'} />
        <Map
          id={'centerMap'}
          mapboxAccessToken={
            'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
          }
          mapStyle='mapbox://styles/mapbox/dark-v11'
          initialViewState={{
            longitude: -100,
            latitude: 40,
            zoom: 3,
          }}
          style={{ width: 268, height: 460 }}
          onDrag={handleMove}
          {...displayedMapViewState}
        />
        <div
          className={
            'absolute flex justify-around items-center w-full bottom-0 h-16 bg-neutral-50 text-black text-xs rounded-b-lg z-50'
          }
        >
          <div className={'flex flex-col items-center ml-2 p-1.5'}>
            <Home size={24} color={'black'} />
            <p>Home</p>
          </div>
          <div
            className={
              'flex flex-col items-center bg-neutral-300 p-1.5 rounded'
            }
          >
            <MapIcon size={24} color={'black'} />
            <p>Map</p>
          </div>
          <div className={'flex flex-col items-center p-1.5'}>
            <Send size={24} color={'black'} />
            <p>Send</p>
          </div>
          <div className={'flex flex-col items-center p-1.5'}>
            <Cog size={24} color={'black'} />
            <p>Help</p>
          </div>
          <div className={'flex flex-col items-center mr-2 p-1.5'}>
            <User size={24} color={'black'} />
            <p>User</p>
          </div>
        </div>
        <div
          className={
            'absolute flex items-center justify-around top-1 h-10 w-full mx-4'
          }
        >
          <div className={'w-1/6 text-xs'}>2:59</div>
          <div className={'w-20 h-6 rounded-xl bg-neutral-800'} />
          <div className={'flex flex-row gap-2 w-1/6'}>
            <Ellipsis /> <Signal /> <Battery />
          </div>
        </div>
        <div
          className={
            'flex flex-col gap-1.5 p-2 justify-center items-center absolute mx-2 bg-neutral-50 z-50 rounded-xl top-12 left-0 right-0 border border-neutral-200'
          }
        >
          <div
            className={
              'flex flex-row items-center w-full justify-center gap-2 px-1'
            }
          >
            <Input
              placeholder='Search the map...'
              className={'w-full h-7 text-[10px]'}
            />
            <div
              className={
                'flex items-center justify-center border rounded-full w-8 h-7 p-1'
              }
            >
              <Search size={14} />
            </div>
          </div>
          <div
            className={
              'flex flex-row justify-center rounded-lg items-center gap-2 w-48 h-5 border w-3/4 text-xs font-bold font-sans'
            }
          >
            <ChevronDown size={16} />{' '}
            <span className={'text-[8px] font-bold'}>SHOW MAP FILTERS</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapLabelsMaker;
