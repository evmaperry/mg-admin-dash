import React, { useState } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Info, LandPlotIcon, X } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import ColorPicker from '@/components/color-picker';
import { User } from '@supabase/supabase-js';
import { MapMouseEvent } from 'react-map-gl/mapbox';
import { cn } from '@/lib/utils';
import { ColorResult } from 'react-color';
import { createPost } from '../createActions';
import { Input } from '@/components/ui/input';
import TimePicker from '@/components/time-picker';
import DatePicker from '@/components/date-picker';
import HoursPicker, { HourInputs } from '@/components/hours-picker';

const AreaPopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  multiMarkerBundle: { setNewMultiMarker: any; newMultiMarker: any }; // TODO: type this?
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, multiMarkerBundle, getAndSetMapMarkers }) => {
  const [isLoading, setIsLoading] = useState(false);

  const { setNewMultiMarker: setArea, newMultiMarker: area } =
    multiMarkerBundle;

  // send thru to hours-picker
  const [areaHours, setAreaHours] = useState<HourInputs[]>([]);

  // ie, the default state that we'll reset
  // newMultiMarker to in Markers.tsx
  const defaultAreaState = {
    category: undefined,
    coordinates: [],
    event: null,
    color: '#123123',
    primaryText: undefined,
    secondaryText: undefined,
    link: undefined,
    phoneNumber: undefined,
  };

  const AreaColorPicker: React.FC<{}> = ({}) => {
    return (
      <div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant={'outline'} className={'h-8 font-light'}>
              {area.color ? (
                <div className={'flex gap-2 items-center'}>
                  <div
                    className={cn('h-5 w-5 rounded')}
                    style={{ backgroundColor: area.color }}
                  />
                </div>
              ) : (
                'Select a color'
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className={'w-full flex flex-col items-center gap-5 w-[650px]'}
            side='left'
          >
            <div className={'font-mono font-bold'}>{'Route color'}</div>
            <div className={'leading-[1.1]'}>
              {
                'Select a color that contrasts with your chosen map theme or plays on your branding.'
              }
            </div>
            <div>
              <ColorPicker
                onChangeComplete={(
                  colorResult: ColorResult,
                  event: React.ChangeEvent
                ) => {
                  console.log('colorRes', colorResult);
                  setArea({
                    ...area,
                    color: colorResult.hex,
                  });
                }}
                initialColor={area.color as string}
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    );
  };

  const handleTextInput = (e: any) => {
    const { name, value } = e.target;
    setArea({ ...area, [name]: value });
  };

  const handleCreateRoute = async () => {
    setIsLoading(true);

    // const routeId = await createPost(
    //   imageFile as File,
    //   {
    //     ...route,
    //     startDateTime: `${dateTimes.startDate} ${dateTimes.startTime}`,
    //     endDateTime: `${dateTimes.endDate} ${dateTimes.endTime}`,
    //   } as Contentable,
    //   'route',
    //   user,
    //   appId as number
    // );

    // await addPinHoursToDb(pinHours, pinId);

    setArea(defaultAreaState);
    setAreaHours([]);
    getAndSetMapMarkers();
    setIsLoading(false);
  };

  return (
    <div className={'flex flex-col h-full w-full gap-2'}>
      <div className={'flex items-center justify-between w-full'}>
        <div className={'flex items-center gap-2'}>
          <div className={'create-app-form-subtitle'}>MARKER TYPE:</div>
          <div className={'create-app-form-subtitle text-amber-400 font-bold'}>
            AREA
          </div>
          <LandPlotIcon className={'text-amber-400'} />
        </div>
        <Popover>
          <PopoverContent className={'instructions-container'}>
            <Label>Step 1</Label>
            <div>
              Click the map to start a new route, then continue clicking to add
              turns to your route. You can also click on an existing route to
              add an turn to it. You can click and drag on the route's start,
              end, or any turn to relocate them.
            </div>
            <Label>Step 2</Label>
            <div>Select the route type and path color.</div>
            <Label>Step 3</Label>
            <div>Select an image for the pin.</div>
            <Label>Step 4</Label>
            <div>Add details and the route's start and end times.</div>
          </PopoverContent>
          <PopoverTrigger asChild>
            <Button variant={'instructions'} size={'sm'}>
              <Info />
              Instructions
            </Button>
          </PopoverTrigger>
        </Popover>
      </div>
      <Separator />
      {/* BODY */}
      <div
        className={'flex w-full flex-col items-between h-full justify-between'}
      >
        {/* COORDINATES */}
        <div className={'flex items-center w-full rounded gap-4 text-sm'}>
          <Label>Corners</Label>
          <div>{area.coordinates.length}</div>
          <Label>Distance</Label>
          <div>TODO</div>
        </div>

        {/* COLOR SELECTOR */}
        <div className={'flex gap-4 justify-start items-center text-sm'}>
          <Label>Color</Label>
          <AreaColorPicker />
        </div>

        {/* TEXT / TIMES */}
        <div className={'flex flex-col gap-1 w-full'}>
          {/* TEXT DETAILS */}
          <div className={'flex flex-col gap-1 w-full'}>
            <div className={'flex items-center gap-2 text-sm'}>
              <div className={'flex w-40 gap-4'}>
                <Label>Details</Label>
              </div>
              <Input
                name={'primaryText'}
                value={area.primaryText}
                onChange={handleTextInput}
                placeholder='Name'
                className={'w-full text-center h-8'}
              />
            </div>
            <div className={'flex flex-row items-center gap-1'}>
              <Input
                placeholder='Description'
                value={area.secondaryText}
                name={'secondaryText'}
                onChange={handleTextInput}
                className={'w-full text-center h-8'}
              />
            </div>
          </div>
        </div>
        <div className={'flex flex-row items0center gap-4'}>
          <div className={'flex items-center gap-1 text-sm'}>
            <Label>Hours</Label>
            <div>(optional)</div>
          </div>
          <HoursPicker
            hoursBundle={{ hours: areaHours, setHours: setAreaHours }}
          />
        </div>
        <Separator />
        <div className={'flex items-center gap-2 w-full'}>
          <Button
            className={'bg-amber-400 w-full items-center gap-2'}
            onClick={() => handleCreateRoute()}
          >
            <LandPlotIcon /> Add area
          </Button>
          <Button
            className={'w-full gap-2'}
            variant={'destructive'}
            onClick={() => {
              setArea(defaultAreaState);
            }}
          >
            <X /> Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AreaPopup;
