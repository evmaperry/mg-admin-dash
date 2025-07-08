import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info, LandPlotIcon } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ColorPicker from '@/components/color-picker';
import { User } from '@supabase/supabase-js';
import { MapMouseEvent } from 'react-map-gl/mapbox';
import { cn } from '@/lib/utils';
import { ColorResult } from 'react-color';

const StructurePopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  multiMarkerBundle: { setNewMultiMarker: any; newMultiMarker: any }; // TODO: type this?
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, multiMarkerBundle, getAndSetMapMarkers }) => {
  return <div>Structures</div>;
};

export default StructurePopup;
