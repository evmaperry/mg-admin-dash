import { App } from '@/types/types';
import { createStore } from 'zustand';

export type DashboardConfigState = {
  selectedApp: App | null;
};

export type DashboardConfigActions = {
  setSelectedApp: (selectedApp: App | null) => void;
};

export type DashboardConfigStore = DashboardConfigState &
  DashboardConfigActions;

export const defaultInitState: DashboardConfigState = {
  selectedApp: {name: 'Fruitfest+'},
};

export const createDashboardConfigStore = (
  initState: DashboardConfigState = defaultInitState
) => {
  return createStore<DashboardConfigStore>()((set) => ({
    ...initState,
    setSelectedApp: (selectedApp: App | null) =>
      set((state) => {
        return { ...state, selectedApp };
      }),
  }));
};
