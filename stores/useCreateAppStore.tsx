import { App } from '@/types/types';
import { Position } from 'geojson';
import { createStore } from 'zustand';
import { IAppColors } from '@/components/create/AppColorPickers';
interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

interface AppDetails {
  'App name': string | null;
  'Event name': string | null;
  'Start date': Date | undefined;
  'End date': Date | undefined;
  'Start time': string | null;
  'End time': string | null;
}

export type CreateAppState = {
  centerMapViewState: MapViewState | null;
  appDetails: AppDetails;
  appColors: IAppColors;
  mapTheme: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12'
};

export type CreateAppActions = {
  setCenterMapViewState: (centerMapViewState: MapViewState) => void;
  setAppDetails: (AppDetailsPartialObj: Partial<AppDetails>) => void;
  setAppColors: (AppColorsPartialObj: Partial<IAppColors>) => void;
  setMapTheme: (mapTheme: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12') => void;
};

export type CreateAppStore = CreateAppState & CreateAppActions;

export const defaultInitState: CreateAppState = {
  centerMapViewState: null,
  appDetails: {
    'App name': null,
    'Event name': null,
    'Start date': undefined,
    'End date': undefined,
    'Start time': null,
    'End time': null,
  },
  appColors: {
    primary: '#312e81',
    primaryContainer: '#e2e8f0',
    onPrimaryContainer: '#312e81',
    onPrimaryContainerUnselected: '#475569',
    inversePrimary: '#4f46e5',
    secondary: '#ef4444',
    outline: '#94a3b8',
    surfaceVariant: '#f1f5f9',
  },
  mapTheme: 'light-v11',
};

export const createCreateAppStore = (
  initState: CreateAppState = defaultInitState
) => {
  return createStore<CreateAppStore>()((set) => ({
    ...initState,
    setCenterMapViewState: (centerMapViewState: MapViewState) => {
      set((state) => {
        return { ...state, centerMapViewState };
      });
    },
    setAppDetails: (newAppDetail: Partial<AppDetails>) => {
      set((state) => {
        return {
          ...state,
          appDetails: { ...state.appDetails, ...newAppDetail },
        };
      });
    },
    setAppColors: (newColor: Partial<IAppColors>) => {
      set((state) => {
        return {
          ...state,
          appColors: {
            ...state.appColors,
            ...newColor,
          },
        };
      });
    },
    setMapTheme: (mapTheme: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12') => {
      set((state)=> {
        return {
          ...state,
          mapTheme
        }
      })
    }
  }));
};
