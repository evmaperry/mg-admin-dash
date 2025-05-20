'use client';
import React, { useEffect } from 'react';
import AppDetailInputs from './AppDetailInputs';
import CenterMapDialog from './CenterMapDialog';
import { AppColorPickers } from './AppColorPickers';
import AddMarkersMap from './AddMarkersMap';
import MapMarkerTable from './MapMarkerTable';
import { Button } from '../ui/button';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { User } from '@supabase/supabase-js';

const CreateForms: React.FC<{ user: User }> = ({ user }) => {
  const {
    appId,
    appDetails,
    markers,
    centerMapViewState,
    appColors,
    mapTheme,
  } = useCreateAppStore((state) => state);

  return (
    <div className={'flex w-full pb-12'}>
      {appId ? (
        <div className={'flex flex-col gap-6 w-full'}>
          <div className={'flex flex-col gap-3 w-full'}>
            <div className={'create-event-form-title'}>The basics</div>
            <AppDetailInputs />
          </div>

          <div className={'flex flex-row gap-6 items-center w-[500px]'}>
            <div className={'create-event-form-title w-36'}>Map frame</div>
            <CenterMapDialog />
          </div>

          <div className={'flex flex-col gap-3'}>
            <div className={'create-event-form-title'}>Colors</div>
            <AppColorPickers />
          </div>

          <div className={'flex flex-col gap-3'}>
            <div className={'create-event-form-title'}>
              Add Markers to Your Map
            </div>
            <AddMarkersMap user={user} />
          </div>

          <div className={'flex flex-col gap-3'}>
            <div className={'create-event-form-title'}>Your app's markers</div>
            <MapMarkerTable />
          </div>
        </div>
      ) : (
        <div>Please select an existing app or create a new one.</div>
      )}
    </div>
  );
};

export default CreateForms;
