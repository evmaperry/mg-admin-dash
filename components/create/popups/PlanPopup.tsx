import { Contentable, Plan, Post } from 'mgtypes/types/Content';
import React, { useState, useRef, useEffect } from 'react';
import { createPost, getAddressFromCoordinates } from '../createActions';
import { MapMouseEvent } from 'mapbox-gl';
import { User } from '@supabase/supabase-js';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CreateAppMarkers } from 'mgmarkers/markerConfig';
import capitalize from 'lodash/capitalize';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Input } from '@/components/ui/input';
import {
  ArrowDown,
  CalendarIcon,
  ChevronDown,
  ImageOff,
  Info,
  X,
} from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Calendar } from '@/components/ui/calendar';
import TimePicker from '@/components/time-picker';
import DatePicker from '@/components/date-picker';
import { cn } from '@/lib/utils';
import dayjs from 'dayjs';
import { setDate } from 'date-fns';
import { Label } from '@/components/ui/label';

const PlanPopup: React.FC<{
  lastClickEvent: MapMouseEvent | null;
  user: User;
  setPlanMarkerIcon: (category: string, type: string) => void;
  getAndSetMapMarkers: () => void;
}> = ({ lastClickEvent, user, setPlanMarkerIcon, getAndSetMapMarkers }) => {
  const { appDetails, setCanSave, appId } = useCreateAppStore((state) => state);

  const defaultPlanState = {
    longitude: null,
    latitude: null,
    address: '',
    phoneNumber: '',
    link: '',
    primaryText: '',
    secondaryText: '',
    planCategory: '',
    planType: '',
  };

  const [plan, setPlan] = useState<Partial<Plan>>(defaultPlanState);

  const [dateTimes, setDateTimes] = useState<{
    startDate: string | undefined;
    startTime: string | undefined;
    endDate: string | undefined;
    endTime: string | undefined;
  }>({
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
  });

  const [imageFile, setImageFile] = useState<File>();
  const [image, setImage] = useState<string>();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleMapClick = async () => {
    const address = await getAddressFromCoordinates(
      lastClickEvent?.lngLat.lat as number,
      lastClickEvent?.lngLat.lng as number
    );

    const formattedAddress = address.split(',').slice(0, 2).join(',');

    setPlan({
      ...plan,
      longitude: lastClickEvent?.lngLat.lng ?? 0,
      latitude: lastClickEvent?.lngLat.lat ?? 0,
      address: formattedAddress,
    });
  };

  useEffect(() => {
    handleMapClick();
  }, [lastClickEvent]);

  const PlanSelector: React.FC<{}> = ({}) => {
    const dropdownMenuGroup = Object.entries(CreateAppMarkers.plan).reduce(
      (acc: any[], cur: [string, string[]], index: number, array: any) => {
        acc.push(
          <DropdownMenuSub key={`dropdown-pin-category-${index}`}>
            <DropdownMenuSubTrigger>
              {capitalize(cur[0])}
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                {cur[1].map((planType: string, index2: number) => {
                  return (
                    <DropdownMenuItem
                      key={`dropdown-pin-type-${index}-${index2}`}
                      className={'flex flex-row items-center gap-2'}
                      onClick={() => {
                        setPlan({ ...plan, planCategory: cur[0], planType });
                        setPlanMarkerIcon(cur[0], planType);
                      }}
                    >
                      <Image
                        src={`/assets/images/plan-${cur[0]}-${planType}.png`}
                        height={24}
                        width={24}
                        alt={'alt'}
                      />
                      <div>{capitalize(planType.replaceAll('_', ' '))}</div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        );
        return acc;
      },
      []
    );

    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={'outline'} className={'font-light h-8 w-48 mx-auto'}>
            {plan.planType && plan.planCategory ? (
              <div className={'flex flex-row items-center gap-2'}>
                <Image
                  src={`/assets/images/plan-${plan.planCategory}-${plan.planType}.png`}
                  height={24}
                  width={24}
                  alt={'alt'}
                />
                <div>{capitalize(plan.planType)}</div>
              </div>
            ) : (
              <div>Select a plan type</div>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuGroup className={'flex flex-col'}>
            {dropdownMenuGroup}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  };

  const handleFileSelection = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setImageFile(file);
    setImage(file ? URL.createObjectURL(file) : undefined);
  };

  const handleTextInput = (e: any) => {
    const { name, value } = e.target;
    setPlan({ ...plan, [name]: value });
  };

  const handleCreatePlan = async () => {
    setIsLoading(true);

    const pinId = await createPost(
      imageFile as File,
      {
        ...plan,
        startDateTime: `${dateTimes.startDate} ${dateTimes.startTime}`,
        endDateTime: `${dateTimes.endDate} ${dateTimes.endTime}`,
      } as Contentable,
      'plan',
      user,
      appId as number
    );

    // await addPinHoursToDb(pinHours, pinId);
    setPlan(defaultPlanState);
    setDateTimes({
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
    });
    getAndSetMapMarkers();
    setIsLoading(false);
  };

  return (
    <div className={'flex flex-col w-full h-full gap-2'}>
      <div className={'flex items-center justify-between w-full'}>
        <div className={'flex items-center gap-2'}>
          <div className={'create-app-form-subtitle'}>MARKER TYPE:</div>
          <div className={'create-app-form-subtitle text-sky-400 font-bold'}>
            PLAN
          </div>
          <CalendarIcon className={'text-sky-400'} />
        </div>
        <Popover>
          <PopoverContent className={'instructions-container'}>
            <Label>Step 1</Label>
            <div>
              Click the map to create a new plan. The coordinates and address
              (if available) will display in the panel. You can also click on an
              existing plan to edit it.
            </div>
            <Label>Step 2</Label>
            <div>Select the plan type.</div>
            <Label>Step 3</Label>
            <div>Select an image for the plan.</div>
            <Label>Step 4</Label>
            <div>Add details and the plan's start and end times.</div>
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
        <div
          className={
            'flex flex-col justify-center w-full rounded gap-1 text-sm'
          }
        >
          <div className={'flex text-sm flex-row justify-between items-center'}>
            <Label>Location</Label>
            <div className={'flex'}>
              <div className={'italic w-8'}>Lat:</div>
              <div
                className={'w-16'}
              >{`${plan.latitude ? Number(plan.latitude).toFixed(3) : 'N/A'}`}</div>
            </div>

            <div className={'flex'}>
              <div className={'italic w-8'}>Lng:</div>
              <div
                className={'w-16'}
              >{`${plan.longitude ? Number(plan.longitude).toFixed(3) : 'N/A'}`}</div>
            </div>
          </div>
          <div className={'flex gap-1'}>
            <div className={'flex gap-1 truncate'}>
              <div className={'italic w-16'}>Address:</div>
              <div className={''}>
                {plan.latitude === 0 && plan.longitude === 0
                  ? 'N/A'
                  : plan.address}
              </div>
            </div>
          </div>
        </div>

        {/* PLAN SELECTOR */}
        <div className={'flex items-center'}>
          <Label>Type</Label> <PlanSelector />
        </div>

        {/* IMAGE */}
        <div className={'flex flex-row items-center gap-4'}>
          <div className={'flex flex-col gap-2'}>
            <Label>Image</Label>

            <div className={'flex w-60'}>
              <Input
                className={'popup-file-input'}
                ref={fileInputRef}
                disabled={isLoading}
                type='file'
                accept='image/*'
                placeholder=''
                id='upload-results'
                onChange={(event) => {
                  handleFileSelection(event);
                }}
              />
            </div>
          </div>

          <div className={'flex flex-row items-center'}>
            {image ? (
              <Image
                className={'rounded'}
                alt={'The image associated with the pin being created'}
                src={image}
                height={75}
                width={75}
              />
            ) : (
              <div
                className={
                  'flex items-center justify-center rounded text-center border-2 p-2 border-dashed border-neutral-600 bg-neutral-200 h-[75px] w-[75px] text-sm'
                }
              >
                <ImageOff />
              </div>
            )}
          </div>
        </div>

        {/* TEXT / TIME */}
        <div className={'flex flex-col gap-1 w-full'}>
          {/* TEXT DETAILS */}
          <div className={'flex flex-col gap-1 w-full'}>
            <div className={'flex items-center gap-2 text-sm'}>
              <div className={'flex w-40 gap-4 items-center'}>
                <Label>Details</Label>
              </div>
              <Input
                name={'primaryText'}
                value={plan.primaryText}
                onChange={handleTextInput}
                placeholder='Pin title'
                className={'w-full text-center h-8'}
              />
            </div>
            <div className={'flex flex-row items-center gap-1'}>
              <Input
                placeholder='Description'
                value={plan.secondaryText}
                name={'secondaryText'}
                onChange={handleTextInput}
                className={'w-full text-center h-8'}
              />
            </div>
            <div className={'flex flex-row items-center gap-1 w-full'}>
              <Input
                placeholder='Phone (optional)'
                value={plan.phoneNumber as string}
                name={'phoneNumber'}
                onChange={handleTextInput}
                className={'w-1/2 text-center h-8'}
              />
              <Input
                placeholder='Link (optional)'
                value={plan.link as string}
                name={'link'}
                onChange={handleTextInput}
                className={'w-1/2 text-center h-8'}
              />
            </div>
          </div>

          {/* TIMES */}
          <div className={'flex flex-col gap-1'}>
            {/* START */}
            <div className={'flex flex-row items-center justify-between gap-1'}>
              <Label className={'w-1/5'}>Start</Label>
              <DatePicker
                onSelect={(selectedStartDate: Date) => {
                  setDateTimes({
                    ...dateTimes,
                    startDate: String(selectedStartDate),
                  });
                }}
                selectedDateString={dateTimes.startDate}
                hint={'Date'}
                triggerClassName={cn(
                  !dateTimes.startDate && 'text-muted-foreground',
                  'w-2/5'
                )}
              />
              <TimePicker
                onSelectTime={(time: string) => {
                  setDateTimes({ ...dateTimes, startTime: time });
                }}
                timeToDisplay={dateTimes.startTime}
                hint={'Time'}
                triggerClassName='w-2/5'
              />
            </div>
            {/* END */}
            <div className={'flex flex-row items-center justify-between gap-1'}>
              <Label className={'w-1/5 '}>End</Label>
              <DatePicker
                onSelect={(selectedEndDate: Date) => {
                  setDateTimes({
                    ...dateTimes,
                    endDate: String(selectedEndDate),
                  });
                }}
                selectedDateString={dateTimes.endDate}
                // isTextMuted={!dateTimes.endDate}
                hint={'Date'}
                triggerClassName={cn(
                  !dateTimes.endDate && 'text-muted-foreground',
                  'w-2/5'
                )}
              />
              <TimePicker
                onSelectTime={(time: string) => {
                  setDateTimes({ ...dateTimes, endTime: time });
                }}
                timeToDisplay={dateTimes.endTime}
                hint='Time'
                triggerClassName={'w-2/5'}
              />
            </div>
          </div>
        </div>
      </div>

      <Separator />
      <div className={'flex items-center w-full gap-2'}>
        <Button
          className={'bg-sky-500 w-full items-center gap-2'}
          onClick={() => handleCreatePlan()}
        >
          <CalendarIcon /> Add plan
        </Button>
        <Button
          className={'w-full gap-2'}
          variant={'destructive'}
          onClick={() => {
            setPlan(defaultPlanState);
          }}
        >
          <X /> Cancel
        </Button>
      </div>
    </div>
  );
};

export default PlanPopup;
