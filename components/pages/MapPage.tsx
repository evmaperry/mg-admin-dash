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

// Map page used for coloring
const MapPage: React.FC<{
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    inversePrimary: string;
  };
}> = ({ colors }) => {
  const { primary, primaryContainer, secondary, inversePrimary } = colors;

  const showMapFiltersButtonClassName = `text-[8px] font-bold bg-[${inversePrimary}] text-background`;

  const { centerMapViewState } = useCreateAppStore((state) => state);

  const viewState = centerMapViewState ?? {
    longitude: -74.006,
    latitude: 40.712,
    zoom: 14,
  };

  return (
    <div className='flex relative items-center justify-center overflow-hidden border-4 border-neutral-800 shadow rounded-[38px] pt-10 pb-16 max-w-[276px] max-h-[572px]'>
      <Map
        id={'centerMap'}
        mapboxAccessToken={
          'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
        }
        mapStyle='mapbox://styles/mapbox/light-v11'
        style={{ width: 268, height: 460 }}
        {...viewState}
      />
      <div
        className={
          'absolute flex justify-around items-center w-full bottom-0 h-16 bg-neutral-50 text-black text-xs font-bold rounded-b-lg z-50'
        }
        style={{ backgroundColor: primaryContainer }}
      >
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center ml-2 p-1.5'}
        >
          <Copy size={24} />
          <p>HOME</p>
        </div>
        <div className={'flex flex-col items-center p-1.5'}>
          <MapPin size={24} color={primary} />
          <p style={{ color: primary }}>MAP</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center p-1.5'}
        >
          <Info size={24} />
          <p>HELP</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center p-1.5'}
        >
          <Cog size={24} />
          <p>INFO</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center mr-2 p-1.5'}
        >
          <CirclePlus size={24} />
          <p>POST</p>
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
        style={{ backgroundColor: primaryContainer }}
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
            style={{ backgroundColor: primary }}
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
  );
};

export default MapPage;
