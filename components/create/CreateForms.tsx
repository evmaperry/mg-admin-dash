'use client';
import React, { useEffect } from 'react';
import AppDetailInputs from './AppDetailInputs';
import MapLabelMaker from './MapLabelMaker';
import { AppColorPickers } from './AppColorPickers';
import AddMarkersMap from './AddMarkersMap';
import MapMarkerTable from './MapMarkerTable';
import { Button } from '../ui/button';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { User } from '@supabase/supabase-js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { HelpCircle, HelpingHand, Info } from 'lucide-react';

const CreateForms: React.FC<{ user: User }> = ({ user }) => {
  const { appId } = useCreateAppStore((state) => state);

  return (
    <div className={'flex w-full pb-12'}>
      {appId ? (
        <div className={'flex flex-col gap-12 w-full items-center'}>
          {/* THE BASICS */}
          <div
            className={
              'flex flex-col gap-3 w-full bg-neutral-100 rounded p-6 max-w-4xl shadow'
            }
          >
            <div className={'flex items-center gap-4'}>
              <div className={'create-event-form-title'}>1. The basics</div>
              {/*  INSTRUCTIONS */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={'sm'} variant={'outline'}>
                    <Info className={'mr-1'} /> Instructions
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={'leading-[1.2] font-light w-[600px]'}
                >
                  <div>Basics go here</div>
                </PopoverContent>
              </Popover>
            </div>
            <AppDetailInputs />
          </div>

          {/* COLORS */}
          <div
            className={'flex flex-col gap-3 bg-neutral-100 rounded p-6 shadow max-w-7xl w-full'}
          >
            <div className={'flex gap-4 items-center'}>
              <div className={'create-event-form-title'}>2. Colors</div>
              {/*  INSTRUCTIONS */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={'sm'} variant={'outline'}>
                    <Info className={'mr-1'} /> Instructions
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={'leading-[1.2] font-light w-[600px]'}
                >
                  <div>Color instructions go here</div>
                </PopoverContent>
              </Popover>
            </div>
            <AppColorPickers />
          </div>

          <div className={'flex flex-col gap-3 bg-neutral-100 p-6'}>
            <div className={'flex items-center gap-4'}>
              <div className={'create-event-form-title'}>
                Add Markers to Your Map
              </div>
              {/*  INSTRUCTIONS */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={'sm'} variant={'outline'}>
                    <Info className={'mr-1'} /> Instructions
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={'leading-[1.2] font-light w-[600px]'}
                >
                  <div>Marker map instructions go here</div>
                </PopoverContent>
              </Popover>
            </div>
            <AddMarkersMap user={user} />
          </div>

          <div className={'flex flex-col gap-3'}>
            <div className={'create-event-form-title'}>Your app's markers</div>
            <MapMarkerTable />
          </div>

          <div className={'flex flex-col gap-3'}>
            <div className={'flex gap-4 items-center'}>
              <div className={'create-event-form-title'}>Map Labels</div>
              {/*  INSTRUCTIONS */}
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={'sm'} variant={'outline'}>
                    <Info className={'mr-1'} /> Instructions
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={'leading-[1.2] font-light w-[600px]'}
                >
                  <div>
                    The map displays different content depending on how zoomed
                    in the view is. When the map is relatively zoomed in, the
                    user sees pins, routes and plans. When the map is relatively
                    zoomed out, the user sees labels, which locate the event
                    within a wider geographic context and help to section off
                    the areas of your event.
                  </div>
                  <div>
                    Click and drag the map to re-center your event in the frame
                    of the phone to best display the boundaries of your event.
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <MapLabelMaker />
          </div>
        </div>
      ) : (
        <div>Please select an existing app or create a new one.</div>
      )}
    </div>
  );
};

export default CreateForms;
