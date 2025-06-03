import { Position } from 'geojson';
import { createStore } from 'zustand';
import { AppColors, MapLabels, MapLabel } from 'mgtypes/types/App';
import { App } from 'mgtypes/types/App';

export interface AppDetails {
  'App name': string | undefined;
  'Event name': string | undefined;
  'Start date': string | undefined;
  'End date': string | undefined;
  'Start time': string | undefined;
  'End time': string | undefined;
  'Event longitude': number | undefined;
  'Event latitude': number | undefined;
}

interface MapMarkers {
  pins: { [id: string]: any }; // TODO: type these
  plans: { [id: string]: any };
  routes: { [id: string]: any };
  structures: { [id: string]: any };
  areas: { [id: string]: any };
}

export type CreateAppState = {
  canSave: boolean; // indicates a saveable change has been made
  appId: number | undefined;
  appDetails: AppDetails;
  appColors: AppColors;
  mapTheme: 'light' | 'streets' | 'dark' | 'outdoors';
  markers: MapMarkers;
  mapLabels: MapLabels;
};

export type CreateAppActions = {
  setAppId: (appId: number) => void;
  setAppDetails: (AppDetailsPartialObj: Partial<AppDetails>) => void;
  setAppColors: (AppColorsPartialObj: Partial<AppColors>) => void;
  setMapTheme: (mapTheme: 'light' | 'streets' | 'dark' | 'outdoors') => void;
  setMarkers: (markers: MapMarkers) => void;
  setApp: (app: any) => void;
  addMapLabel: (mapLabel: MapLabel, zoomElevation: number) => void;
  setZoomThresholds: (zoomThresholds: number[]) => void;
  setCanSave: (canSave: boolean) => void;
  addCoordinate: (
    markerType: 'route' | 'structure' | 'area',
    markerId: number,
    index: number,
    coordinate: Position
  ) => void;
  moveCoordinate: (
    markerType: 'route' | 'structure' | 'area',
    markerId: number,
    index: number,
    coordinate: Position
  ) => void;
};

export type CreateAppStore = CreateAppState & CreateAppActions;

export const defaultInitState: CreateAppState = {
  appId: 1,
  canSave: false,
  appDetails: {
    'App name': undefined,
    'Event name': undefined,
    'Start date': undefined,
    'End date': undefined,
    'Start time': undefined,
    'End time': undefined,
    'Event latitude': undefined,
    'Event longitude': undefined,
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
  mapTheme: 'light',
  markers: {
    pins: [],
    plans: [],
    routes: [],
    structures: [],
    areas: [],
  },
  mapLabels: {
    zoomThresholds: [16.25, 15],
    labels: [
      [
        {
          title: 'Midway',
          icon: 'ferris-wheel',
          latitude: 44.765391,
          longitude: -85.623055,
          iconColor: 'darkcyan',
          image: null,
          boundingBox: [
            [-85.623708, 44.765085],
            [-85.622463, 44.765679],
          ], //
        },
        {
          title: 'Festival Stage',
          icon: 'microphone',
          latitude: 44.766354,
          longitude: -85.625294,
          image: null,
          iconColor: 'indigo',
          boundingBox: [
            [-85.625902, 44.765997],
            [-85.624572, 44.766954],
          ], // -85.625855,44.766031
        },
        {
          title: 'Food Court',
          icon: 'food',
          latitude: 44.766292,
          longitude: -85.623728,
          iconColor: 'lightcoral',
          image: null,
          boundingBox: [
            [-85.624957, 44.765931],
            [-85.622636, 44.766931],
          ], //
        },
        {
          title: 'Beer Tent',
          icon: 'beer',
          latitude: 44.767252,
          longitude: -85.623873,
          iconColor: 'sandybrown',
          image: null,
          boundingBox: [
            [-85.624638, 44.766967],
            [-85.623147, 44.767746],
          ], //
        },
      ],
      [
        {
          title: 'National Fruit Festival',
          icon: 'party-popper',
          latitude: 44.766686,
          longitude: -85.623914,
          iconColor: 'red',
          image: 'logo-small',
          boundingBox: [
            [-85.626142, 44.765011],
            [-85.622337, 44.767645],
          ], //
        },
      ],
    ],
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
          ...state,
          canSave,
        };
      });
    },
    setAppId: (appId: number) => {
      set((state) => {
        return { ...state, appId };
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
    setAppColors: (newColor: Partial<AppColors>) => {
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
    setMapTheme: (mapTheme: 'light' | 'streets' | 'dark' | 'outdoors') => {
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

        // appId and eventLocation do not need to be set
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
            'Event latitude': app.eventLatitude,
            'Event longitude': app.eventLongitude,
          },
          markers: {
            pins: app.pins,
            plans: [],
            routes: app.routes,
            areas: [],
            structures: [],
          },
          appColors: app.appColors,
          mapTheme: app.mapTheme,
        };
      });
    },
    setZoomThresholds: (zoomThresholds: number[]) => {
      set((state) => {
        return {
          ...state,
          mapLabels: { ...state.mapLabels, zoomThresholds },
        };
      });
    },
    addMapLabel: (mapLabel: MapLabel, zoomElevation: number) => {
      set((state) => {
        const newLabelsArrays = [...state.mapLabels.labels];

        newLabelsArrays[zoomElevation].push(mapLabel);
        return {
          ...state,
          mapLabels: {
            ...state.mapLabels,
            labels: newLabelsArrays,
          },
        };
      });
    },
    addCoordinate: (
      markerType: 'route' | 'structure' | 'area',
      markerId: number,
      index: number,
      coordinate: Position
    ) => {
      const pluralMarkerType: 'routes' | 'structures' | 'areas' = (markerType +
        's') as 'routes' | 'structures' | 'areas';

      set((state) => {
        return {
          ...state,
          markers: {
            ...state.markers,
            [pluralMarkerType]: {
              ...state.markers[pluralMarkerType],
              [state.markers[pluralMarkerType][markerId].id]: {
                ...state.markers[pluralMarkerType][markerId],
                coordinates: state.markers[pluralMarkerType][
                  markerId
                ].coordinates.toSpliced(index, 0, coordinate),
              },
            },
          },
        };
      });
    },
    moveCoordinate: (
      markerType: 'route' | 'structure' | 'area',
      markerId: number,
      index: number,
      coordinate: Position
    ) => {
      console.log('movingCoord', markerType, markerId, index, coordinate);
      const pluralMarkerType: 'routes' | 'structures' | 'areas' = (markerType +
        's') as 'routes' | 'structures' | 'areas';

      set((state) => {
        console.log('here', state.markers[pluralMarkerType])
        const updatedCoords =
          state.markers[pluralMarkerType][markerId].coordinates;

        updatedCoords[index] = coordinate;
        return {
          ...state,
          markers: {
            ...state.markers,
            [pluralMarkerType]: {
              [state.markers[pluralMarkerType][markerId].id]: {
                ...state.markers[pluralMarkerType][markerId],
                coordinates: updatedCoords,
              },
            },
          },
        };
      });
    },
  }));
};
