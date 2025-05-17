'use client'
import React, { useState } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Button } from '../ui/button';
import {
  Battery,
  ChevronDown,
  Cog,
  Ellipsis,
  Home,
  MapIcon,
  Search,
  Send,
  Signal,
  Target,
  User,
  ZoomIn,
  ZoomOut,
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

const CenterMapDialog: React.FC<{}> = ({}) => {
  const [isCenterMapVisible, setIsCenterMapVisible] = useState<boolean>(false);
  const { centerMapViewState, setCenterMapViewState } = useCreateAppStore(
    (state) => state
  );

  const CenterMap: React.FC<{}> = () => {
    const [displayedCenterMapViewState, setDisplayedCenterMapViewState] =
      useState<{
        latitude: number;
        longitude: number;
        zoom: number;
      }>({
        latitude: centerMapViewState ? centerMapViewState.latitude : 44.15,
        longitude: centerMapViewState ? centerMapViewState.longitude : -85.73,
        zoom: centerMapViewState ? centerMapViewState.zoom : 3,
      });

    const handleMove = (e: ViewStateChangeEvent) => {
      setDisplayedCenterMapViewState(e.viewState);
    };

    const saveCenter = () => {
      setCenterMapViewState({
        latitude: displayedCenterMapViewState.latitude,
        longitude: displayedCenterMapViewState.longitude,
        zoom: displayedCenterMapViewState.zoom,
      });
    };

    return (
      <div className={'flex flex-col gap-3 justify-center items-center'}>
        {/* CONTROLS */}
        <div
          className={
            'flex flex-row items-center w-full gap-1 justify-between text-sm'
          }
        >
          <div className={'flex flex-col'}>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Lat:&nbsp;</span>
              {displayedCenterMapViewState.latitude?.toFixed(3)}
            </div>

            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Lon:&nbsp;</span>
              {displayedCenterMapViewState.longitude?.toFixed(3)}
            </div>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Zoom:&nbsp;</span>
              {displayedCenterMapViewState.zoom}
            </div>
          </div>
          {/* Zoom/Save/Close buttons */}
          <div className={'flex gap-2 w-full justify-end'}>
            <Button
              onClick={() => {
                setDisplayedCenterMapViewState({
                  ...displayedCenterMapViewState,
                  zoom: displayedCenterMapViewState.zoom + 1,
                });
              }}
              size={'icon'}
            >
              <ZoomIn />
            </Button>
            <Button
              onClick={() => {
                setDisplayedCenterMapViewState({
                  ...displayedCenterMapViewState,
                  zoom: displayedCenterMapViewState.zoom - 1,
                });
              }}
              size={'icon'}
            >
              <ZoomOut />
            </Button>
            <Button
              onClick={() => {
                saveCenter();
                setIsCenterMapVisible(false);
              }}
            >
              Save
            </Button>
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
            {...displayedCenterMapViewState}
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

  return (
    <Dialog open={isCenterMapVisible}>
      <DialogTrigger asChild>
        <Button
          className={'w-full'}
          onClick={() => setIsCenterMapVisible(true)}
        >
          {centerMapViewState === null
            ? "Click to mark the event's center"
            : `Lat: ${centerMapViewState['latitude'].toFixed(3)} / Lon: ${centerMapViewState['longitude'].toFixed(3)} / Zoom: ${centerMapViewState['zoom']}`}
        </Button>
      </DialogTrigger>
      <DialogContent
        className={'w-[450px] font-mono'}
        showclosebutton={'false'}
      >
        <DialogHeader>
          <div className={'flex flex-row w-full items-center justify-between'}>
            <DialogTitle>Set the map zoom and center</DialogTitle>
            <Button
              variant={'destructive'}
              onClick={() => setIsCenterMapVisible(false)}
            >
              X
            </Button>
          </div>
          <DialogDescription
            className={'flex flex-col gap-2 leading-[1.1] font-sans'}
          >
            <span>
              1. Click and drag the map to set the event's center location with
              the bulls-eye.
            </span>
            <span>
              2. Zoom to best fit your event's footprint in the window —
              this is how the map will be framed when it loads in the app.
            </span>
          </DialogDescription>
        </DialogHeader>
        <CenterMap />
      </DialogContent>
    </Dialog>
  );
};

export default CenterMapDialog;
