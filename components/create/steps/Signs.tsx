'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Button } from '../../ui/button';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpLeft,
  Circle,
  Info,
  Target,
  X,
} from 'lucide-react';
import { Map, ViewStateChangeEvent, Marker } from 'react-map-gl/mapbox';
import { Input } from '../../ui/input';
import { Slider } from '@/components/ui/slider';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Label } from '../../ui/label';
import { capitalize, range } from 'lodash';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { getPanelElement } from 'react-resizable-panels';
import MockupTopBar from '../../pages/TopBar';
import MockupBottomNav from '../../pages/BottomNav';
import MockupMapSearchContainer from '../../pages/MapSearchContainer';
import { MapLabel } from 'mgtypes/types/Content';
import ColorPicker from '../../color-picker';
import { MapMouseEvent } from 'mapbox-gl';
import Link from 'next/link';
import { Badge } from '../../ui/badge';
import Icon from '@mdi/react';
import { labelSelectorConfig, labelRawIcons } from '../labelConfig';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu';
import { mdiHome, mdiMagnifyPlus, mdiCancel, mdiClose } from '@mdi/js';
import { convertMapThemeToStyleURL } from '@/utils/mapbox/utils';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const SignMarker: React.FC<{ label: Partial<MapLabel> }> = ({ label }) => {
  const { appColors } = useCreateAppStore((state) => state);

  return (
    <Marker
      longitude={label.longitude as number}
      latitude={label.latitude as number}
    >
      <div className={'flex flex-col items-center'}>
        {/* SIGN */}
        <div
          className={
            'flex flex-col items-center gap-1 bg-neutral-50 border rounded-lg py-2 px-1'
          }
        >
          <div className={'flex gap-[5px] items-start max-h-9 max-w-[100px]'}>
            <div className={'flex items-center w-full gap-[5px]'}>
              {label.icon && label.iconColor ? (
                <div>
                  <Icon
                    path={labelRawIcons[label.icon]}
                    color={label.iconColor}
                    size={0.9}
                  />
                </div>
              ) : (
                <div className={'text-xs py-1'}>?</div>
              )}

              <div className={'flex text-center leading-[1.0] text-[13px]'}>
                {label.title ?? 'N/A'}
              </div>
            </div>
            <div className={'flex flex-col grow'}>
              <Icon path={mdiClose} size={0.5} />
            </div>
          </div>

          <Badge
            style={{ backgroundColor: appColors.primary }}
            className={'gap-1 justify-center mx-auto text-xs'}
          >
            <Icon path={mdiMagnifyPlus} size={0.5} />
            <div className={'text-[10px] font-bold'}>ZOOM IN</div>
          </Badge>
        </div>
        {/* SIGN POST */}
        <div className={'h-3 w-1 bg-neutral-50'} />
      </div>
    </Marker>
  );
};

const Signs: React.FC<{}> = ({}) => {
  const {
    appDetails,
    setAppDetails,
    mapSigns,
    addMapLabel,
    setZoomThresholds,
    appColors,
    mapTheme,
  } = useCreateAppStore((state) => state);

  const zoomPanelColors = {
    upperLevel: '#60a5fa', // blue-400
    middleLevel: '#d97706', // amber-400
    lowerLevel: '#0d9488', // emerald-400
    upperThreshold: '#9333ea', // purple-600
    lowerThreshold: '#047857', // emerald-700
  };

  const [displayedMapViewState, setDisplayedMapViewState] = useState<{
    latitude: number | undefined;
    longitude: number | undefined;
    zoom: number;
  }>({
    latitude: undefined,
    longitude: undefined,
    zoom: 16,
  });

  const handleDrag = (e: ViewStateChangeEvent) => {
    setDisplayedMapViewState(e.viewState);
    setAppDetails({
      ...appDetails,
      'Event latitude': e.viewState.latitude,
      'Event longitude': e.viewState.longitude,
    });
  };

  useEffect(() => {
    setDisplayedMapViewState({
      ...displayedMapViewState,
      latitude: appDetails['Event latitude'] as number,
      longitude: appDetails['Event longitude'] as number,
    });
  }, [appDetails['Event latitude'], appDetails['Event longitude']]);

  const setThresholdsFromLayout = (sizes: number[]) => {
    console.log('sizes', sizes);

    const eventLabelThreshold = (sizes[0] * 23) / 100;
    const areaLabelThreshold = ((sizes[0] + sizes[1]) * 23) / 100;

    setZoomThresholds([areaLabelThreshold, eventLabelThreshold]);
  };

  const [defaultPanelSizes, setDefaultPanelSizes] = useState<{
    ground: number;
    area: number;
    event: number;
  }>();

  /**
   * Sets panel sizes (out of 100) based on app's zoom thresholds (out of 23 (0-22)).
   *
   * zoomThreshold[0] = area labels
   * zoomThreshold[1] = event labels
   */

  const setDefaultSizesFromThresholds = () => {
    const [areaThresh, satThresh] = mapSigns.zoomThresholds;
    const event = 100 * (satThresh / 23);
    const ground = 100 * ((23 - areaThresh) / 23);
    const area = 100 - event - ground;

    setDefaultPanelSizes({
      ground,
      event,
      area,
    });
  };

  // only set panel sizes on first load
  useEffect(() => {
    setDefaultSizesFromThresholds();
  }, []);

  const [isInAddLabelMode, setIsInAddLabelMode] = useState<boolean>(false);

  interface CreateAppMapLabel extends MapLabel {
    iconRaw: string; // encoded icon from @mdi/js
    iconName: string; // name that displays on Popover trigger on selection
  }

  const [label, setLabel] = useState<Partial<CreateAppMapLabel>>({ title: '' });

  const handleTitleInput = (e: any) => {
    const { value, name } = e.target;
    setLabel({ ...label, title: value });
  };

  const initAddLabel = (e: MapMouseEvent) => {
    setLabel({ ...label, latitude: e.lngLat.lat, longitude: e.lngLat.lng });
    setIsInAddLabelMode(true);
  };

  const handleAddLabel = () => {
    // TODO:
  };

  const labelDropdownMenuGroup = Object.entries(labelSelectorConfig).reduce(
    (
      acc: any[],
      cur: [
        category: string,
        { [type: string]: { iconRaw: string; icon: string } },
      ],
      index: number,
      array: any
    ) => {
      acc.push(
        <DropdownMenuSub key={`dropdown-pin-category-${index}`}>
          <DropdownMenuSubTrigger>
            {capitalize(cur[0].replaceAll('_', ' '))}
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              {Object.entries(cur[1]).map(
                (
                  cur: [labelType: string, { iconRaw: string; icon: string }],
                  index2: number
                ) => {
                  return (
                    <DropdownMenuItem
                      key={`dropdown-label-type-${index}-${index2}`}
                      className={'flex flex-row items-center gap-2'}
                      onClick={() => {
                        setLabel({
                          ...label,
                          icon: cur[1].icon,
                          iconRaw: cur[1].iconRaw,
                          iconName: cur[0],
                        });
                      }}
                    >
                      <Icon path={cur[1].iconRaw ?? ''} className='h-6 w-6' />
                      <div>{capitalize(cur[0].replaceAll('_', ' '))}</div>
                    </DropdownMenuItem>
                  );
                }
              )}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
      );
      return acc;
    },
    []
  );

  return (
    <div
      className={
        'create-app-form-container w-full flex-row justify-around xl:px-6 2xl:px-18'
      }
    >
      {/* PHONE CONTAINER */}
      <div
        className={
          'flex flex-col items-center justify-center h-full border pt-4 pb-6 gap-3 px-8 rounded shadow'
        }
      >
        <div className={'create-app-form-subtitle'}>Map page</div>
        {/* PHONE */}
        <div className='flex flex-col items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] min-w-[276px] h-[572px]'>
          {/* FAKE TOP BAR */}
          <MockupTopBar />

          {/* MAP CONTAINER */}
          <div className={'flex grow relative'}>
            <MockupMapSearchContainer colors={appColors} />

            {displayedMapViewState?.latitude &&
              displayedMapViewState.longitude && (
                <Map
                  id={'centerMap'}
                  mapboxAccessToken={
                    'pk.eyJ1IjoiZXZtYXBlcnJ5IiwiYSI6ImNtYWZrdGh0ZzAzdDQya29peGt6bnYzNHoifQ.6tScEewTDMdUvwV6_Bbdiw'
                  }
                  mapStyle={convertMapThemeToStyleURL(mapTheme)}
                  initialViewState={{
                    longitude: -100,
                    latitude: 40,
                    zoom: 13,
                  }}
                  style={{ width: 268, height: 460 }}
                  onDrag={handleDrag}
                  {...displayedMapViewState}
                  onClick={initAddLabel}
                >
                  {/* MAP CENTER */}
                  <Marker
                    longitude={appDetails['Event longitude'] as number}
                    latitude={appDetails['Event latitude'] as number}
                  >
                    <Target size={20} className={'text-red-400'} />
                  </Marker>

                  {/* NEW LABEL */}
                  {isInAddLabelMode && <SignMarker label={label} />}

                  {/* EVENT LABEL(S) */}
                  {displayedMapViewState.zoom < mapSigns.zoomThresholds[1] &&
                    mapSigns.labels[1].map(
                      (eventLabel: MapLabel, index: number) => {
                        return (
                          <SignMarker
                            key={`sat-label-marker-${index}`}
                            label={eventLabel}
                          />
                        );
                      }
                    )}

                  {/* AREA LABELS */}
                  {displayedMapViewState.zoom > mapSigns.zoomThresholds[1] &&
                    displayedMapViewState.zoom < mapSigns.zoomThresholds[0] &&
                    mapSigns.labels[0].map(
                      (areaLabel: MapLabel, index: number) => {
                        return (
                          <SignMarker
                            key={`area-label-marker-${index}`}
                            label={areaLabel}
                          />
                        );
                      }
                    )}
                </Map>
              )}
          </div>

          {/* BOTTOM NAV */}
          <MockupBottomNav colors={appColors} page={'map'} />
        </div>
      </div>

      {/* CONTROL PANEL */}
      <div
        className={
          'flex items-center my-auto gap-2 border bg-neutral-200 p-3 rounded shadow'
        }
      >
        {/* ZOOM SETTINGS */}
        <div
          className={
            'create-app-form-subcontainer shadow-none gap-4 justify-between'
          }
        >
          {/* TITLE / INSTRUCTIONS */}
          <div className={'flex w-full justify-center items-center gap-2'}>
            <div className={'create-app-form-subtitle text-center'}>
              Zoom settings
            </div>
            <Popover>
              <PopoverTrigger asChild>
                <Button size={'sm'} variant={'instructions'}>
                  <Info />
                  Instructions
                </Button>
              </PopoverTrigger>
              <PopoverContent className={'instructions-container'}>
                {/* <Label>Intro</Label>
                <div>
                  The map features three zoom levels. Different content is
                  displayed on the map depending on the zoom, which ranges
                  between 0 (most zoomed-out) and 22 (most zoomed-in).
                </div> */}

                {/*
                <Table className={'border font-sans'}>
                  <TableHeader>
                    <TableRow>
                      <TableHead className={'w-24'}>Zoom level</TableHead>
                      <TableHead>Displays</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow className={'bg-neutral-700 text-neutral-50'}>
                      <TableCell>Upper</TableCell>
                      <TableCell>
                        Regional signs (for event locales, towns, etc.)
                      </TableCell>
                    </TableRow>
                    <TableRow className={'bg-neutral-500 text-neutral-50'}>
                      <TableCell>Middle</TableCell>
                      <TableCell>
                        Event signs (for map areas, parking, fields, etc.)
                      </TableCell>
                    </TableRow>
                    <TableRow className={'bg-neutral-300'}>
                      <TableCell>Lower</TableCell>
                      <TableCell>Pins, plans & routes</TableCell>
                    </TableRow>
                  </TableBody>
                </Table> */}
                <div>These three levels are separated by two thresholds:</div>
                <ol className={'list-disc ml-12 my-2'}>
                  <li
                    className={'underline decoration-solid decoration-2'}
                    style={{
                      textDecorationColor: zoomPanelColors.upperThreshold,
                    }}
                  >
                    upper threshold
                  </li>
                  <li
                    className={'underline decoration-solid decoration-2'}
                    style={{
                      textDecorationColor: zoomPanelColors.lowerThreshold,
                    }}
                  >
                    lower threshold
                  </li>
                </ol>
                <div>
                  The map loads just below the{' '}
                  <span
                    className={
                      'p-[2px] underline decoration-red-400 decoration-solid decoration-2'
                    }
                  >
                    lower threshold
                  </span>{' '}
                  to display pins, plans, and routes. Use the diagram to adjust
                  the zoom thresholds according to the geography of your event.
                  Click the grey handles in the zoom diagram and drag them to
                  adjust the zoom thresholds.
                </div>
                <div>
                  You can also change the zoom on the map to see the results of
                  changing the zoom threshold. The zoom is changed with the
                  vertical slider on the left edge of the zoom diagram.
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* ZOOM PANELS & ZOOM */}
          <div className={'flex flex-col gap-2 w-full'}>
            {/* ZOOM PANELS */}
            <div className={'flex flex-row h-[300px] pl-2'}>
              {/* SLIDER */}
              <div className={'flex flex-col h-full'}>
                <Slider
                  orientation='vertical'
                  value={[displayedMapViewState?.zoom as number]}
                  onValueChange={(e) => {
                    setDisplayedMapViewState({
                      ...displayedMapViewState,
                      zoom: Math.round(e[0] * 4) / 4, // rounds to nearest 1/4
                    });
                  }}
                  min={0}
                  max={22}
                  step={0.25}
                  inverted={true}
                  disabled={isInAddLabelMode}
                />
              </div>
              {/* SCALE */}
              <div
                className={'flex flex-col text-right py-[1px] h-full ml-4 mr-1'}
              >
                {range(23).map((number) => (
                  <div
                    key={`zoom-graph-y-axis-${number}`}
                    className={'text-xs font-mono leading-[1.08]'}
                  >
                    {number}
                  </div>
                ))}
              </div>

              {/* PANELS */}
              <div
                className={
                  'relative flex flex-col items-end justify-end w-full h-full'
                }
              >
                {defaultPanelSizes && (
                  <ResizablePanelGroup
                    direction='vertical'
                    onLayout={(sizes) => {
                      setThresholdsFromLayout(sizes);
                    }}
                    className={'w-full tracking-tight text-center text-pretty'}
                  >
                    <ResizablePanel
                      id={'event'}
                      className={
                        'text-xs flex flex-col justify-between font-mono text-neutral-50 items-center pb-2 px-2'
                      }
                      defaultSize={defaultPanelSizes.event}
                      style={{ backgroundColor: zoomPanelColors.upperLevel }}
                    >
                      <div className=''>🛩️ Upper level ☁️</div>
                      <div
                        className={
                          'flex flex-col w-full leading-[1.1] text-center'
                        }
                      >
                        <div>Upper threshold</div>

                        <ArrowDown className={'mx-auto'} />
                      </div>
                    </ResizablePanel>
                    <ResizableHandle
                      withHandle
                      className={'border-2 border-purple-600'}
                    />
                    <ResizablePanel
                      id={'area'}
                      className={
                        'flex flex-col justify-center text-neutral-50 items-center text-xs font-mono px-4'
                      }
                      style={{ backgroundColor: zoomPanelColors.middleLevel }}
                      defaultSize={defaultPanelSizes.area}
                    >
                      Middle level
                    </ResizablePanel>
                    <ResizableHandle
                      withHandle
                      className={'border-2 border-red-400'}
                    />
                    <ResizablePanel
                      className={cn(
                        'flex text-xs font-mono flex-col justify-between items-center pt-2 px-2 text-neutral-50'
                      )}
                      style={{ backgroundColor: zoomPanelColors.lowerLevel }}
                      id={'ground'}
                      defaultSize={defaultPanelSizes.ground}
                    >
                      <div
                        className={
                          'flex flex-col w-full leading-[1.1] text-center'
                        }
                      >
                        <ArrowUp className={'mx-auto'} />
                        Lower threshold
                      </div>
                      <div>🌱 Ground level 🐜</div>
                    </ResizablePanel>
                  </ResizablePanelGroup>
                )}
              </div>
            </div>

            {/* ZOOM */}
            <div className={'flex text-sm flex-row items-center font-light'}>
              <div className={'italic w-[44px]'}>Zoom</div>
              <div className={'w-16 font-bold'}>
                {displayedMapViewState.zoom}
              </div>
            </div>
            {/* ZOOM INSTRUCTIONS */}
          </div>
          {/* KEY */}
          {/* THIS IS THE WIDEST SUBCOMPONENT AND SETS THE WIDTH */}
          <div className={'text-sm items-center flex gap-2'}>
            <Label>Thresholds</Label>

            <div className={'flex items-center gap-1 font-light'}>
              <span
                className={
                  'underline decoration-solid decoration-2 decoration-purple-600 italic'
                }
              >
                Upper:
              </span>
              <span className={'w-10'}>
                {mapSigns.zoomThresholds[1].toFixed(2)}
              </span>
            </div>
            <div className={'flex items-center gap-1 font-light'}>
              <span
                className={
                  'underline decoration-red-400  decoration-2 decoration-soliditalic'
                }
              >
                Lower:
              </span>
              <span className={'w-10'}>
                {mapSigns.zoomThresholds[0].toFixed(2)}
              </span>
            </div>
          </div>
        </div>

        {/* CENTER & CREATE */}
        <div className={'flex flex-col gap-2 min-w-72 justify-between h-full'}>
          {/* MAP CENTER */}
          <div className={'create-app-form-subcontainer shadow-none gap-2'}>
            <div className={'flex flex-row items-center gap-2 w-full'}>
              <div className={'create-app-form-subtitle text-center'}>
                Map center
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    className={'mx-auto'}
                    size={'sm'}
                    variant={'instructions'}
                  >
                    <Info />
                    Instructions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={'instructions-container'}>
                  <Label>Step 1</Label>
                  <div>
                    Click and drag the map in the Map page panel to set the
                    map's center coordinates. If a user opts out of sharing
                    their location, then the map will load centered over these
                    coordinates.
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div
              className={
                'flex flex-row justify-around items-center gap-5 w-full text-sm font-light'
              }
            >
              <Target size={24} className={'text-red-400'} />
              <div className={'flex flex-row w-24'}>
                <span className={'italic'}>Lat:&nbsp;</span>
                {appDetails['Event latitude'] &&
                  appDetails['Event latitude'].toFixed(3)}
              </div>
              <div className={'flex flex-row w-24'}>
                <span className={'italic'}>Lng:&nbsp;</span>
                {appDetails['Event longitude'] &&
                  appDetails['Event longitude'].toFixed(3)}
              </div>
            </div>
          </div>

          {/* CREATE SIGN FORM */}
          <div
            className={
              'create-app-form-subcontainer gap-2 justify-between shadow-none'
            }
          >
            <div className={'flex items-center justify-around gap-2'}>
              <div className={'create-app-form-subtitle text-center'}>
                Create sign
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size={'sm'} variant={'instructions'}>
                    <Info />
                    Instructions
                  </Button>
                </PopoverTrigger>
                <PopoverContent className={'instructions-container'}>
                  <Label className={'w-20'}>Step 1&nbsp;</Label>
                  <div>Click the map where you'd like to add a label.</div>

                  <Label className={'w-20'}>Step 2</Label>
                  <div className={'text-xs leading-[1.2]'}>
                    Use the vertical slider in the Zoom settings to change the
                    target zoom level.
                  </div>
                </PopoverContent>
              </Popover>
            </div>

            <Label>Location</Label>
            <div className={'flex gap-4 items-center text-sm font-light'}>
              <div className={'flex gap-1'}>
                <span className={'italic'}>Lat: </span>
                {label.latitude?.toFixed(3) ?? 'N/A'}
              </div>
              <div className={'flex gap-1'}>
                <span className={'italic'}>Lng: </span>
                {label.longitude?.toFixed(3) ?? 'N/A'}
              </div>
            </div>

            <div
              className={
                'flex flex-col text-xs tracking-tighter justify-center w-full items-center h-12 gap-1'
              }
            >
              {displayedMapViewState.zoom < mapSigns.zoomThresholds[1] ? (
                <div
                  className={
                    'py-[1px] px-[2px] font-mono w-full text-neutral-50 flex flex-col items-center'
                  }
                  style={{
                    backgroundColor: zoomPanelColors.upperLevel,
                  }}
                >
                  <div>This label will be added to the</div>
                  <div>Upper level</div>
                </div>
              ) : displayedMapViewState.zoom > mapSigns.zoomThresholds[0] ? (
                <div
                  style={{
                    backgroundColor: zoomPanelColors.lowerLevel,
                  }}
                  className={
                    'py-[1px] px-[2px] font-mono w-full text-neutral-50 flex flex-col items-center'
                  }
                >
                  <div>❌ No signs in the Lower level.</div>
                  <div>
                    Zoom to{' '}
                    <span
                      className={'py-[1px] px-[2px] font-mono text-neutral-50'}
                      style={{ backgroundColor: zoomPanelColors.upperLevel }}
                    >
                      Upper
                    </span>{' '}
                    or{' '}
                    <span
                      className={'py-[1px] px-[2px] font-mono text-neutral-50'}
                      style={{ backgroundColor: zoomPanelColors.middleLevel }}
                    >
                      Middle
                    </span>{' '}
                    level.
                  </div>
                </div>
              ) : (
                <div
                  className={
                    'py-[1px] px-[2px] font-mono w-full text-neutral-50 flex flex-col items-center'
                  }
                  style={{
                    backgroundColor: zoomPanelColors.middleLevel,
                  }}
                >
                  <div>This label will be added to the</div>
                  <div>Middle level</div>
                </div>
              )}
            </div>
            <Label>Details</Label>
            <Input
              name={'title'}
              onChange={handleTitleInput}
              // disabled={!isInAddLabelMode}
              placeholder={'Sign text'}
              value={label.title}
              className='h-8 font-light text-center'
            />
            <div className={'flex flex-row gap-1'}>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={'w-full h-8'}
                    // disabled={!isInAddLabelMode}
                  >
                    {label.iconName && label.iconRaw ? (
                      <div className={'flex items-center gap-2'}>
                        <Icon
                          path={label.iconRaw}
                          className={'h-6 w-6'}
                          color={label.iconColor ?? 'black'}
                        />
                        {label.iconName}
                      </div>
                    ) : (
                      'Select icon'
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuGroup>
                    {labelDropdownMenuGroup}
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    className={'w-full h-8'}
                    // disabled={!isInAddLabelMode}
                  >
                    {label.iconColor ? (
                      <div className={'flex items-center gap-2'}>
                        <div
                          className={'w-6 h-6 rounded'}
                          style={{ backgroundColor: label.iconColor as string }}
                        />
                        {label.iconColor}
                      </div>
                    ) : (
                      <div>Select color</div>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={'flex w-[650px]'}
                  align='center'
                  side='left'
                >
                  <ColorPicker
                    onChangeComplete={(colorResult, event) => {
                      setLabel({ ...label, iconColor: colorResult.hex });
                    }}
                    initialColor='#7e22ce'
                  />
                </PopoverContent>
              </Popover>
            </div>
            <Separator />
            <div className={'flex gap-2 w-full'}>
              <Button
                className={'w-full'}
                disabled={
                  //     !isInAddLabelMode ||
                  !label.icon || !label.iconColor || label.title?.length === 0
                }
              >
                Add label
              </Button>
              <Button
                className={'w-full gap-1'}
                variant={'destructive'}
                onClick={() => {
                  setLabel({ title: '' });
                  setIsInAddLabelMode(false);
                }}
              >
                <X /> Cancel
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signs;
