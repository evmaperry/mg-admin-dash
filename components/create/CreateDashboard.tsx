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

const CreateDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { appId, setUserId, selectedStep } = useCreateAppStore(
    (state) => state
  );

  useEffect(() => {
    setUserId(user.id);
  }, [user]);

  return (
    <div className={'flex flex-col gap-2 w-full h-[calc(100dvh-77px)] overflow-scroll pb-[77px]'}>
      <div className={'flex flex-row w-full justify-between px-6 pt-4 pb-2'}>
        <div className={'flex gap-2 items-center'}>
          <SidebarTrigger className='-ml-1' />
          <Separator orientation='vertical' className='mr-2' />
        </div>

        <Button className={'bg-indigo-600 w-48 gap-2'}><Save />Save draft</Button>
      </div>
      {appId ? (
        <div className={'flex w-full items-center px-6'}>
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
