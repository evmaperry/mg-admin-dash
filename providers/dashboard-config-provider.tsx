'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from 'react';
import { useStore } from 'zustand';

import {
  type DashboardConfigStore,
  createDashboardConfigStore,
} from '@/stores/useDashboardConfigStore';

export type DashboardConfigStoreApi = ReturnType<typeof createDashboardConfigStore>;

export const DashboardConfigStoreContext = createContext<
  DashboardConfigStoreApi | undefined
>(undefined);

export interface DashboardConfigStoreProviderProps {
  children: ReactNode;
}

export const DashboardConfigStoreProvider = ({
  children,
}: DashboardConfigStoreProviderProps) => {
  const storeRef = useRef<DashboardConfigStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createDashboardConfigStore();
  }

  return (
    <DashboardConfigStoreContext.Provider value={storeRef.current}>
      {children}
    </DashboardConfigStoreContext.Provider>
  );
};

export const useDashboardConfigStore = <T,>(
  selector: (store: DashboardConfigStore) => T
): T => {
  const dashboardConfigStoreContext = useContext(DashboardConfigStoreContext);

  if (!dashboardConfigStoreContext) {
    throw new Error(
      `useDashboardConfigStore must be used within DashboardConfigStoreProvider`
    );
  }

  return useStore(dashboardConfigStoreContext, selector);
};