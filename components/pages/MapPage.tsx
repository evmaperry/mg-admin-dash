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
import React, { useEffect, useState } from 'react';
import { Input } from '../ui/input';
import { Map, ViewState, ViewStateChangeEvent } from 'react-map-gl/mapbox';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { IConfigurableColor } from '../create/AppColorPickers';
import { cn } from '@/lib/utils';
import { AppColors } from 'mgtypes/types/App';
import MockupBottomNav from './BottomNav';
import MockupTopBar from './TopBar';
import MockupMapSearchContainer from './MapSearchContainer';
import { convertMapThemeToStyleURL } from '@/utils/mapbox/utils';
// Map page used for coloring
const MapPage: React.FC<{
  colors: AppColors;
}> = ({ colors }) => {
  const {
    primary,
    primaryContainer,
    secondary,
    inversePrimary,
    onPrimaryContainerUnselected,
    outline,
    surfaceVariant,
  } = colors;

  const showMapFiltersButtonClassName = `text-[8px] font-bold bg-[${inversePrimary}] text-background`;

  const { mapTheme, setAppDetails, appDetails } = useCreateAppStore(
    (state) => state
  );

  const [mapViewState, setMapViewState] = useState<ViewState>({
    zoom: 14,
    latitude: 45.0,
    longitude: -45.0,
    bearing: 0,
    pitch: 0,
    padding: {
      top: 0,
      bottom: 0,
      right: 0,
      left: 0,
    },
  });

  useEffect(() => {
    setMapViewState({
      ...mapViewState,
      longitude: appDetails['Event longitude'] as number,
      latitude: appDetails['Event latitude'] as number,
    });
  }, [appDetails['Event longitude'], appDetails['Event latitude']]);


  console.log('mapTheme', mapTheme)
  return (
    <div className='flex flex-col items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] w-[276px] h-[572px]'>
      {/* FAKE TOP BAR */}
      <MockupTopBar />

      {/* MAP CONTAINER */}
      <div className={'flex grow relative'}>
        {appDetails['Event latitude'] && appDetails['Event longitude'] && (
          <Map
            id={'centerMap'}
            mapboxAccessToken={
              'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
            }
            mapStyle={convertMapThemeToStyleURL(mapTheme)}
            style={{ width: 268, height: 460 }}
            initialViewState={{ ...mapViewState }}
            {...mapViewState}
          />
        )}

        <MockupMapSearchContainer colors={colors} />
      </div>

      {/* BOTTOM NAV */}
      <MockupBottomNav colors={colors} page={'map'} />
    </div>
  );
};

export default MapPage;
