import {
  Battery,
  ChevronDown,
  CirclePlus,
  Cog,
  Copy,
  Ellipsis,
  Info,
  MapPin,
  Search,
  Signal,
} from 'lucide-react';
import React, { useState } from 'react';
import { Input } from '../ui/input';
import { Map, ViewStateChangeEvent } from 'react-map-gl/mapbox';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { ConfigurableColor } from '../create/AppColorPickers';
import { cn } from '@/lib/utils';
import { IAppColors } from '../create/AppColorPickers';
import MockupBottomNav from './BottomNav';
import MockupTopBar from './TopBar';

// Map page used for coloring
const MapPage: React.FC<{
  colors: IAppColors;
}> = ({ colors }) => {
  const {
    primary,
    primaryContainer,
    secondary,
    inversePrimary,
    onPrimaryContainerUnselected,
    outline,
  } = colors;

  const showMapFiltersButtonClassName = `text-[8px] font-bold bg-[${inversePrimary}] text-background`;

  const { centerMapViewState } = useCreateAppStore((state) => state);

  const viewState = centerMapViewState ?? {
    longitude: -74.006,
    latitude: 40.712,
    zoom: 14,
  };

  return (
    <div className='flex flex-col items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] w-[276px] h-[572px]'>
      {/* FAKE TOP BAR */}
      <MockupTopBar />

      {/* MAP CONTAINER */}
      <div className={'flex grow relative'}>
        <Map
          id={'centerMap'}
          mapboxAccessToken={
            'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
          }
          mapStyle='mapbox://styles/mapbox/light-v11'
          style={{ width: 268, height: 460 }}
          {...viewState}
        />

        {/* SEARCH AND FILTERS */}
        <div
          className={
            'flex flex-col gap-1.5 p-2 justify-center items-center absolute mx-2 bg-neutral-50 z-50 rounded-xl top-2 left-0 right-0 border'
          }
          style={{ backgroundColor: primaryContainer, borderColor: outline  }}
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
              style={{ backgroundColor: primary, borderColor: outline  }}
              className={
                'flex items-center justify-center border rounded-full w-8 h-7 p-1'
              }
            >
              <Search size={14} color={'white'} />
            </div>
          </div>
          <div
            className={
              'flex flex-row justify-center rounded-lg items-center gap-2 w-48 h-5 border w-3/4 text-xs font-bold font-sans'
            }
            style={{ backgroundColor: inversePrimary }}
          >
            <ChevronDown size={16} className={'text-background'} />{' '}
            <span className={showMapFiltersButtonClassName}>
              SHOW MAP FILTERS
            </span>
          </div>
        </div>
      </div>

      {/* BOTTOM NAV */}
      <MockupBottomNav colors={colors} />
    </div>
  );
};

export default MapPage;
