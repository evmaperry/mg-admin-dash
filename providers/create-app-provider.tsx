'use client';

import {
  type ReactNode,
  createContext,
  useRef,
  useContext,
} from 'react';
import { useStore } from 'zustand';

import {
  type CreateAppStore,
  createCreateAppStore,
} from '@/stores/useCreateAppStore';

export type CreateAppStoreApi = ReturnType<typeof createCreateAppStore>;

export const CreateAppStoreContext = createContext<
  CreateAppStoreApi | undefined
>(undefined);

export interface CreateAppStoreProviderProps {
  children: ReactNode;
}

export const CreateAppStoreProvider = ({
  children,
}: CreateAppStoreProviderProps) => {
  const storeRef = useRef<CreateAppStoreApi>();
  if (!storeRef.current) {
    storeRef.current = createCreateAppStore();
  }

  return (
    <CreateAppStoreContext.Provider value={storeRef.current}>
      {children}
    </CreateAppStoreContext.Provider>
  );
};

export const useCreateAppStore = <T,>(
  selector: (store: CreateAppStore) => T
): T => {
  const createAppStoreContext = useContext(CreateAppStoreContext);

  if (!createAppStoreContext) {
    throw new Error(
      `useCreateAppStore must be used within CreateAppStoreProvider`
    );
  }

  return useStore(createAppStoreContext, selector);
};