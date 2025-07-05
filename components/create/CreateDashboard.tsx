'use client';
import React, { useEffect } from 'react';
import Basics from './steps/Basics';
import Signs from './steps/Signs';
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
import {
  Table,
  TableHead,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from '../ui/table';
import { Label } from '../ui/label';

const zoomPanelColors = {
  upperLevel: '#60a5fa', // blue-400
  middleLevel: '#d97706', // amber-400
  lowerLevel: '#0d9488', // emerald-400
  upperThreshold: '#9333ea', // purple-600
  lowerThreshold: '#047857', // emerald-700
};

const stepInstructions = {
  basics: 'Basics instructions',
  colors: 'Colors instructions',
  signs: (
    <>
      <Label>Intro</Label>
      <div>
        The app's map is divided into three zoom levels. Different content is
        displayed on the map depending on the map's zoom.
      </div>
      <Table className={'font-mono text-xs tracking-tight'}>
        <TableHeader>
          <TableRow className={'bg-neutral-700 text-neutral-50'}>
            <TableHead className={'w-24 text-neutral-50'}>Zoom level</TableHead>
            <TableHead className={'text-neutral-50'}>Displays</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow
            style={{ backgroundColor: zoomPanelColors.upperLevel }}
            className={'text-neutral-50'}
          >
            <TableCell>Upper</TableCell>
            <TableCell>
              Regional signs (for event locales, towns, etc.)
            </TableCell>
          </TableRow>
          <TableRow
            style={{ backgroundColor: zoomPanelColors.middleLevel }}
            className={'text-neutral-50'}
          >
            <TableCell>Middle</TableCell>
            <TableCell>
              Event signs (for map areas, parking, fields, etc.)
            </TableCell>
          </TableRow>
          <TableRow
            style={{ backgroundColor: zoomPanelColors.lowerLevel }}
            className={'text-neutral-50'}
          >
            <TableCell>Lower</TableCell>
            <TableCell>Pins, plans & routes</TableCell>
          </TableRow>
        </TableBody>
      </Table>
      <div>
        So, in general, the more zoomed in, the more specific the content, and
        the more zoomed out, the more general the content.
      </div>
      <Label>Your task</Label>
      <div>On this page, you'll do three things:</div>{' '}
      <ol className={'list-decimal ml-10'}>
        <li>
          Set the elevations at which the zoom levels are demarcated. You'll use
          the tools in the Zoom settings panel to do this.
        </li>
        <li>Set the map center coordinates in the Map center panel.</li>
        <li>
          Add signs to the upper and middle levels as needed the Create sign
          panel.
        </li>
      </ol>
      <div>
        There are instructions for each task in their respective panels.
      </div>
      <div>Please note that the Zoom slider changes two things:</div>
      <ol className={'list-decimal ml-10'}>
        <li>Adjusts the map's zoom in the Map page panel</li>
        <li>
          Sets the layer at which a sign will be added to the map from the
          Create sign panel.
        </li>
      </ol>
    </>
  ),
  markers: 'Markers instructions',
};

const CreateDashboard: React.FC<{ user: User }> = ({ user }) => {
  const { appId, setUserId, selectedStep } = useCreateAppStore(
    (state) => state
  );

  useEffect(() => {
    setUserId(user.id);
  }, [user]);

  return (
    <div className={'flex flex-col h-[calc(100dvh-80px)]'}>
      <div className={'flex flex-row w-full items-center justify-between px-8 pt-6 pb-2'}>
        <SidebarTrigger className='' />{' '}
        <div className={'flex items-center gap-4'}>
          <div className={'create-app-form-title'}>
            {capitalize(selectedStep)}
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'instructions'}>
                <Info className={'instructions-button'} />
                Instructions
              </Button>
            </PopoverTrigger>
            <PopoverContent className={'instructions-container'}>
              {stepInstructions[selectedStep]}
            </PopoverContent>
          </Popover>
        </div>
        <div className={'flex'}>
          <Button className={'bg-purple-700 w-40 gap-1'}>
            <Save />
            Save draft
          </Button>
        </div>
      </div>
      {appId ? (
        <div
          className={cn(
            'flex flex-col h-full px-4',
            selectedStep !== 'markers' && selectedStep !== 'signs' && 'mt-2'
          )}
        >
          {/* THE BASICS */}
          {selectedStep === 'basics' && <Basics />}

          {/* COLORS */}
          {selectedStep === 'colors' && <Colors />}

          {/* MARKERS */}
          {selectedStep === 'markers' && <Markers user={user} />}

          {/* LABELS */}
          {selectedStep === 'signs' && <Signs />}
        </div>
      ) : (
        <div>Please select an existing app or create a new one.</div>
      )}
    </div>
  );
};

export default CreateDashboard;
