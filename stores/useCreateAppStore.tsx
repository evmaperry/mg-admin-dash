import { App } from '@/types/types';
import { Position } from 'geojson';
import { createStore } from 'zustand';

interface MapViewState {
  latitude: number;
  longitude: number;
  zoom: number;
}

export type CreateAppState = {
  // mapCenterViewState: MapViewState;
  eventCenterPosition: MapViewState | null;
};

export type CreateAppActions = {
  // setMapCenterViewState: (mapCenterViewState: MapViewState) => void;
  setEventCenterPosition: (centerMapViewState: MapViewState) => void;
};

export type CreateAppStore = CreateAppState & CreateAppActions;

export const defaultInitState: CreateAppState = {
  // mapCenterViewState: {
  //     latitude: 44.15,
  //     longitude: -85.73,
  //     zoom: 3,
  // },
  eventCenterPosition: null,
};

export const createCreateAppStore = (
  initState: CreateAppState = defaultInitState
) => {
  return createStore<CreateAppStore>()((set) => ({
    ...initState,
    setEventCenterPosition: (eventCenterPosition: MapViewState) => {
      set((state) => {
        return { ...state, eventCenterPosition };
      });
    },
    // setMapCenterViewState: (mapCenterViewState: MapViewState) =>
    //   set((state) => {
    //     return { ...state, mapCenterViewState };
    //   }),
  }));
};
