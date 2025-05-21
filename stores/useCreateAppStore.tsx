import { Position } from 'geojson';
import { createStore } from 'zustand';
import { IAppColors } from 'mgtypes/types/App';
import { App } from 'mgtypes/types/App';

interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

export interface AppDetails {
  'App name': string | undefined;
  'Event name': string | undefined;
  'Start date': string | undefined;
  'End date': string | undefined;
  'Start time': string | undefined;
  'End time': string | undefined;
}

interface MapMarkers {
  pins: any[]; // TODO: type these
  plans: any[];
  routes: any[];
  structures: any[];
  areas: any[];
  comments: any[];
  photos: any[];
}

export type CreateAppState = {
  canSave: boolean; // indicates a saveable change has been made
  appId: number | undefined;
  centerMapViewState: MapViewState | null;
  appDetails: AppDetails;
  appColors: IAppColors;
  mapTheme: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12';
  markers: MapMarkers;
};

export type CreateAppActions = {
  setAppId: (appId: number) => void;
  setCenterMapViewState: (centerMapViewState: MapViewState) => void;
  setAppDetails: (AppDetailsPartialObj: Partial<AppDetails>) => void;
  setAppColors: (AppColorsPartialObj: Partial<IAppColors>) => void;
  setMapTheme: (
    mapTheme: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12'
  ) => void;
  setMarkers: (markers: MapMarkers) => void;
  setApp: (app: any) => void;
  setCanSave: (canSave: boolean) => void;
};

export type CreateAppStore = CreateAppState & CreateAppActions;

export const defaultInitState: CreateAppState = {
  appId: 1,
  canSave: false,
  centerMapViewState: { latitude: 38, longitude: -90, zoom: 12 },
  appDetails: {
    'App name': undefined,
    'Event name': undefined,
    'Start date': undefined,
    'End date': undefined,
    'Start time': undefined,
    'End time': undefined,
  },
  appColors: {
    primary: '#e5e5e5',
    primaryContainer: '#e5e5e5',
    onPrimaryContainer: '#e5e5e5',
    onPrimaryContainerUnselected: '#e5e5e5',
    inversePrimary: '#e5e5e5',
    secondary: '#e5e5e5',
    outline: '#e5e5e5',
    surfaceVariant: '#e5e5e5',
  },
  mapTheme: 'light-v11',
  markers: {
    comments: [],
    photos: [],
    pins: [],
    plans: [],
    routes: [],
    structures: [],
    areas: [],
  },
};

export const createCreateAppStore = (
  initState: CreateAppState = defaultInitState
) => {
  return createStore<CreateAppStore>()((set) => ({
    ...initState,
    setCanSave: (canSave: boolean) => {
      set((state) => {
        return {
          ...state, canSave
        }
      })
    },
    setAppId: (appId: number) => {
      set((state) => {
        return { ...state, appId };
      });
    },

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
    setMapTheme: (
      mapTheme: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12'
    ) => {
      set((state) => {
        return {
          ...state,
          mapTheme,
        };
      });
    },
    setMarkers: (markers: MapMarkers) => {
      set((state) => {
        return {
          ...state,
          markers,
        };
      });
    },
    setApp: (app: App) => {
      set((state) => {
        const [startDate, startTime] = app.startDateTime.split('T');

        const [endDate, endTime] = app.endDateTime.split('T');

        console.log('app inside setApp', app);

        // appId does not need to be set
        // it's set from AppSelectOrCreate
        return {
          ...state,
          appDetails: {
            'App name': app.appName,
            'Event name': app.eventName,
            'End date': endDate,
            'End time': endTime,
            'Start date': startDate,
            'Start time': startTime,
          },
          markers: {
            pins: app.pins,
            plans: [],
            comments: [],
            photos: [],
            routes: [],
            areas: [],
            structures: [],
          },
          appColors: app.appColors,
        };
      });
    },
  }));
};
