'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import {
  Battery,
  CalendarIcon,
  ChevronDown,
  Cigarette,
  Cog,
  Ellipsis,
  Flag,
  Home,
  MapIcon,
  Navigation,
  Search,
  Send,
  Settings,
  Signal,
  Target,
  User,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';

import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React, { useState, useRef, useEffect } from 'react';
import { Position } from 'geojson';
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  Map,
  MapProvider,
  useMap,
  ViewStateChangeEvent,
  NavigationControl,
} from 'react-map-gl/mapbox';
import { useCreateAppStore } from '@/providers/create-app-provider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const CreatePage: React.FC<{}> = ({}) => {
  const { eventCenterPosition, setEventCenterPosition } = useCreateAppStore(
    (state) => state
  );

  const [pins, setPins] = useState<any[]>([]);
  const [plans, setPlans] = useState<any[]>([]);

  const [eventSpecInputs, setEventSpecInputs] = useState<{
    'Event name': string;
    'App name': string;
  }>({
    'Event name': '',
    'App name': '',
  });

  const [eventDates, setEventDates] = useState<{
    start: Date | undefined;
    end: Date | undefined;
  }>({ start: undefined, end: undefined });

  const [eventTimes, setEventTimes] = useState<{
    start: string;
    end: string;
  }>({
    start: '',
    end: '',
  });

  const [eventColors, setEventColors] = useState<{
    success: string;
    warning: string;
    warningUnselected: string;
    locationPuck: string;
    primaryVariant: string;
    primaryContainerDark: string;
    primaryContainerDarker: string;
    paperThemeColors: {
      primary: string;
      onPrimary: string;
      primaryContainer: string;
      onPrimaryContainer: string;
      secondary: string;
      onSecondary: string;
      secondaryContainer: string;
      onSecondaryContainer: string;
      tertiary: string;
      onTertiary: string;
      tertiaryContainer: string;
      onTertiaryContainer: string;
      error: string;
      onError: string;
      errorContainer: string;
      onErrorContainer: string;
      background: string;
      onBackground: string;
      surface: string;
      onSurface: string;
      surfaceVariant: string;
      onSurfaceVariant: string;
      outline: string;
      outlineVariant: string;
      shadow: string;
      scrim: string;
      inverseSurface: string;
      inverseOnSurface: string;
      inversePrimary: string;
      elevation: {
        level0: string;
        level1: string;
        level2: string;
        level3: string;
        level4: string;
        level5: string;
      };
      surfaceDisabled: string;
      onSurfaceDisabled: string;
      backdrop: string;
    };
  }>({
    success: '#30A28A',
    warning: '#C63E3E',
    warningUnselected: '#C76767',
    locationPuck: '#1A68FF',
    primaryVariant: '#082A59',
    primaryContainerDark: 'rgb(183, 185, 248)',
    primaryContainerDarker: 'rgb(177, 180, 255)',
    paperThemeColors: {
      primary: 'rgb(71, 85, 182)',
      onPrimary: 'rgb(255, 255, 255)',
      primaryContainer: 'rgb(223, 224, 255)',
      onPrimaryContainer: 'rgb(0, 13, 95)',
      secondary: 'rgb(176, 46, 0)',
      onSecondary: 'rgb(255, 255, 255)',
      secondaryContainer: 'rgb(255, 219, 209)',
      onSecondaryContainer: 'rgb(59, 9, 0)',
      tertiary: 'rgb(0, 103, 131)',
      onTertiary: 'rgb(255, 255, 255)',
      tertiaryContainer: 'rgb(188, 233, 255)',
      onTertiaryContainer: 'rgb(0, 31, 42)',
      error: 'rgb(186, 26, 26)',
      onError: 'rgb(255, 255, 255)',
      errorContainer: 'rgb(255, 218, 214)',
      onErrorContainer: 'rgb(65, 0, 2)',
      background: 'rgb(255, 251, 255)',
      onBackground: 'rgb(27, 27, 31)',
      surface: 'rgb(255, 251, 255)',
      onSurface: 'rgb(27, 27, 31)',
      surfaceVariant: 'rgb(227, 225, 236)',
      onSurfaceVariant: 'rgb(70, 70, 79)',
      outline: 'rgb(118, 118, 128)',
      outlineVariant: 'rgb(199, 197, 208)',
      shadow: 'rgb(0, 0, 0)',
      scrim: 'rgb(0, 0, 0)',
      inverseSurface: 'rgb(48, 48, 52)',
      inverseOnSurface: 'rgb(243, 240, 244)',
      inversePrimary: 'rgb(187, 195, 255)',
      elevation: {
        level0: 'transparent',
        level1: 'rgb(246, 243, 251)',
        level2: 'rgb(240, 238, 249)',
        level3: 'rgb(235, 233, 247)',
        level4: 'rgb(233, 231, 246)',
        level5: 'rgb(229, 228, 245)',
      },
      surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
      onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
      backdrop: 'rgba(47, 48, 56, 0.4)',
    },
  });

  const eventSpecInputElements = Object.keys(eventSpecInputs).map(
    (spec: string, index) => {
      return (
        <Input
          key={`event-spec-input-el-${index}`}
          placeholder={spec}
          value={eventSpecInputs[spec]}
          onChange={(e) => {
            setEventSpecInputs({ ...eventSpecInputs, [spec]: e.target.value });
          }}
        />
      );
    }
  );
  const [isCenterMapOpen, setIsCenterMapOpen] = useState<boolean>(false);

  const CenterMap: React.FC<{}> = () => {
    const [mapCenterViewState, setMapCenterViewState] = useState<{
      latitude: number;
      longitude: number;
      zoom: number;
    }>({
      latitude: 44.15,
      longitude: -85.73,
      zoom: 3,
    });

    const handleMove = (e: ViewStateChangeEvent) => {
      setMapCenterViewState(e.viewState);
    };

    const saveCenter = () => {
      setEventCenterPosition({
        latitude: mapCenterViewState.latitude,
        longitude: mapCenterViewState.longitude,
        zoom: mapCenterViewState.zoom,
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
              {mapCenterViewState.latitude?.toFixed(3)}
            </div>

            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Lon:&nbsp;</span>
              {mapCenterViewState.longitude?.toFixed(3)}
            </div>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Zoom:&nbsp;</span>
              {mapCenterViewState.zoom}
            </div>
          </div>
          {/* Zoom/Save/Close buttons */}
          <div className={'flex gap-2 w-full justify-end'}>
            <Button
              onClick={() => {
                setMapCenterViewState({
                  ...mapCenterViewState,
                  zoom: mapCenterViewState.zoom + 1,
                });
              }}
              size={'icon'}
            >
              <ZoomIn />
            </Button>
            <Button
              onClick={() => {
                setMapCenterViewState({
                  ...mapCenterViewState,
                  zoom: mapCenterViewState.zoom - 1,
                });
              }}
              size={'icon'}
            >
              <ZoomOut />
            </Button>
            <Button
              onClick={() => {
                saveCenter();
                setIsCenterMapOpen(false);
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
            {...mapCenterViewState}
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
            <div className={'flex flex-col items-center bg-neutral-300 p-1.5 rounded'}>
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
              <p>Me</p>
            </div>
          </div>
          {/* FAKE TOP BAR */}
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
          {/* SEARCH AND FILTERS */}
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
              <Input placeholder='Search the map...' className={'w-full h-7 text-[10px]'} />
              <Search
                className={'border rounded-full w-8'}
                color={'black'}
                size={28}
              />
            </div>
            <div
              className={
                'flex flex-row justify-center rounded-lg items-center gap-2 w-48 h-5 border w-3/4 text-xs font-bold font-sans'
              }
            >
              <ChevronDown size={16}/> <span className={'text-[8px] font-bold'}>SHOW MAP FILTERS</span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className={'flex flex-col gap-8 w-[500px]'}>
      <div className={'text-3xl font-mono'}>Create an Event</div>

      <div className={'flex flex-col gap-3'}>
        <div className={'create-event-form-title'}>The basics</div>
        {eventSpecInputElements}
      </div>

      <div className={'flex flex-row gap-6 items-center w-full'}>
        <div className={'create-event-form-title'}>Map specs</div>
        <Dialog open={isCenterMapOpen}>
          <DialogTrigger asChild>
            <Button
              className={'w-full'}
              onClick={() => setIsCenterMapOpen(true)}
            >
              {eventCenterPosition === null
                ? "Click to mark the event's center"
                : `Lat: ${eventCenterPosition['latitude'].toFixed(3)} / Lon: ${eventCenterPosition['longitude'].toFixed(3)} / Zoom: ${eventCenterPosition['zoom']}`}
            </Button>
          </DialogTrigger>
          <DialogContent
            className={'w-[450px] font-mono'}
            showclosebutton={'false'}
          >
            <DialogHeader>
              <div
                className={'flex flex-row w-full items-center justify-between'}
              >
                <DialogTitle>Set the map dimensions</DialogTitle>
                <Button
                  variant={'destructive'}
                  onClick={() => setIsCenterMapOpen(false)}
                >
                  X
                </Button>
              </div>
              <DialogDescription
                className={'flex flex-col gap-2 leading-[1.1] font-sans'}
              >
                <span>
                  1. Click and drag the map to set the event's center location
                  with the bulls-eye.
                </span>
                <span>
                  2. Zoom to best fit your event's footprint in the phone's
                  window — this is how the map will be framed in the app.
                </span>
              </DialogDescription>
            </DialogHeader>
            <CenterMap />
          </DialogContent>
        </Dialog>
      </div>

      {/* Start Date Time */}
      <div className={'flex flex-col gap-2'}>
        <div className={'create-event-form-title'}>Event times</div>
        <div className={'flex flex-row gap-2'}>
          <div>
            <div className={'create-event-form-label'}>Select a start date</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !eventDates['end'] && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={'mr-2'} />
                  {eventDates['start'] ? (
                    format(eventDates['start'], 'PPP')
                  ) : (
                    <span>Click here</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={eventDates['start']}
                  onSelect={(value) =>
                    setEventDates({ ...eventDates, start: value })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className={'w-full'}>
            <div className={'create-event-form-label'}>
              Start time <span className={'font-light'}>24-hour clock</span>
            </div>
            <Input
              placeholder='eg, 07:00 or 15:50'
              onChange={(e) =>
                setEventTimes({ ...eventTimes, start: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* End Date Time */}
      <div className={'flex flex-col gap-2'}>
        <div className={'flex flex-row gap-2'}>
          <div>
            <div className={'create-event-form-label'}>Select an end date</div>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={cn(
                    'w-[200px] justify-start text-left font-normal',
                    !eventDates['end'] && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className={'mr-2'} />
                  {eventDates['end'] ? (
                    format(eventDates['end'], 'PPP')
                  ) : (
                    <span>Click here</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-auto p-0' align='start'>
                <Calendar
                  mode='single'
                  selected={eventDates['end']}
                  onSelect={(value) =>
                    setEventDates({ ...eventDates, end: value })
                  }
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          <div className={'w-full'}>
            <div className={'create-event-form-label'}>
              End time <span className={'font-light'}>24-hour clock</span>
            </div>
            <Input
              placeholder='Ending time (24-hour)'
              onChange={(e) =>
                setEventTimes({ ...eventTimes, end: e.target.value })
              }
            />
          </div>
        </div>
      </div>
      {/* Save & Create */}
      <div className={'flex flex-row justify-center gap-3'}>
        <Button>Save</Button>
        <Button>Create</Button>
      </div>
    </div>
  );
};

export default CreatePage;
