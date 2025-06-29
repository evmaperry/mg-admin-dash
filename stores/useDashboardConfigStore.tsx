import { App } from 'mgtypes/types/App';
import { createStore } from 'zustand';

export type DashboardConfigState = {
  selectedApp: Partial<App> | null;
};

export type DashboardConfigActions = {
  setSelectedApp: (selectedApp: Partial<App> | null) => void;
};

export type DashboardConfigStore = DashboardConfigState &
  DashboardConfigActions;

export const defaultInitState: DashboardConfigState = {
  selectedApp: {eventName: 'Fruitfest+'},
};

export const createDashboardConfigStore = (
  initState: DashboardConfigState = defaultInitState
) => {
  return createStore<DashboardConfigStore>()((set) => ({
    ...initState,
    setSelectedApp: (selectedApp: Partial<App> | null) =>
      set((state) => {
        return { ...state, selectedApp };
      }),
  }));
};
