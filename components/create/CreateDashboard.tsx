'use client';
import React, { useEffect } from 'react';
import Basics from './steps/Basics';
import MapLabelsMaker from './steps/Labels';
import { Colors } from './steps/Colors';
import Markers from './steps/Markers';
import MapMarkerTable from './MapMarkerTable';
import { Button } from '../ui/button';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { User } from '@supabase/supabase-js';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { HelpCircle, HelpingHand, Info, Save } from 'lucide-react';
import { SidebarTrigger } from '../ui/sidebar';
import { Separator } from '../ui/separator';
import { cn } from '@/lib/utils';
import { capitalize } from 'lodash';


const stepInstructions = {
  basics :'Basics instructions',
  colors: 'Colors instructions',
  labels: 'Labels instructions',
  markers: 'Markers instructions'
}

const CreateDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { appId, setUserId, selectedStep } = useCreateAppStore(
    (state) => state
  );

  useEffect(() => {
    setUserId(user.id);
  }, [user]);

  return (
    <div className={'flex flex-col h-[calc(100dvh-80px)]'}>
      <div className={'flex flex-row w-full justify-between px-8 pt-6 pb-2'}>
        <div className={'flex items-center gap-4'}>
          <div className={'create-app-form-title'}>
            {capitalize(selectedStep)}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button size={'sm'} variant={'outline'}>
                <Info className={'mr-1'} /> Instructions
              </Button>
            </PopoverTrigger>
            <PopoverContent className={'leading-[1.2] font-light w-[600px]'}>
              <div>{stepInstructions[selectedStep]}</div>
            </PopoverContent>
          </Popover>
        </div>

        <div className={'flex'}>
          <SidebarTrigger className='' />
          <Separator orientation='vertical' className='mx-2' />

          <Button className={'bg-indigo-600 w-48 gap-2'}>
            <Save />
            Save draft
          </Button>
        </div>
      </div>
      {appId ? (
        <div
          className={cn(
            'flex flex-col h-full px-4',
            selectedStep !== 'markers' && 'mt-2'
          )}
        >
          {/* THE BASICS */}
          {selectedStep === 'basics' && <Basics />}

          {/* COLORS */}
          {selectedStep === 'colors' && <Colors />}

          {/* MARKERS */}
          {selectedStep === 'markers' && <Markers user={user} />}

          {/* LABELS */}
          {selectedStep === 'labels' && <MapLabelsMaker />}
        </div>
      ) : (
        <div>Please select an existing app or create a new one.</div>
      )}
    </div>
  );
};

export default CreateDashboard;
