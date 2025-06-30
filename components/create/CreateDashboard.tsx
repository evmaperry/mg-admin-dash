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
import { HelpCircle, HelpingHand, Info } from 'lucide-react';

const CreateDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { appId, setUserId, selectedStep } = useCreateAppStore(
    (state) => state
  );

  useEffect(() => {
    setUserId(user.id);
  }, [user]);

  return (
    <div className={'flex w-full pb-12'}>
      {appId ? (
        <div className={'flex flex-col gap-8 w-full items-center'}>
          <div className={'flex flex-row w-full justify-end'}>
            <Button className={'bg-indigo-600 w-48'}>Save draft</Button>
          </div>
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
