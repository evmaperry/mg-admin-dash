'use client';
import React, { useEffect, useState, useRef } from 'react';
import { useCreateAppStore } from '@/providers/create-app-provider';
import { Button } from '../../ui/button';
import { Info, Target, X } from 'lucide-react';
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

const LabelMarker: React.FC<{ label: Partial<MapLabel> }> = ({ label }) => {
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

const Labels: React.FC<{}> = ({}) => {
  const {
    appDetails,
    setAppDetails,
    mapLabels,
    addMapLabel,
    setZoomThresholds,
    appColors,
    mapTheme,
  } = useCreateAppStore((state) => state);

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
    const [areaThresh, satThresh] = mapLabels.zoomThresholds;
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
      className={'create-app-form-container w-full flex-row justify-around'}
    >
      {/* LEFT SIDE: ZOOM TOOLS */}
      <div className={'flex flex-col gap-4 w-full max-w-[300px]'}>
        {/* ZOOM HEIGHTS PROFILE */}
        <div className={'create-app-form-subcontainer gap-2'}>
          <div className={'create-app-form-subtitle text-center'}>
            Zoom thresholds
          </div>
          <div className={'flex flex-row h-[300px] gap-1'}>
            {/* PANELS */}
            <div
              className={
                'relative flex flex-col items-end justify-end border-2 w-full h-full'
              }
            >
              {defaultPanelSizes && (
                <ResizablePanelGroup
                  direction='vertical'
                  onLayout={(sizes) => {
                    setThresholdsFromLayout(sizes);
                  }}
                  className={'w-full tracking-tighter'}
                >
                  <ResizablePanel
                    id={'event'}
                    className={
                      'flex flex-col justify-end items-center bg-neutral-700'
                    }
                    defaultSize={defaultPanelSizes.event}
                  />
                  <ResizableHandle
                    withHandle
                    className={'border-2 border-fuchsia-400'}
                  />
                  <ResizablePanel
                    id={'area'}
                    className={
                      'flex flex-col justify-end items-center bg-neutral-500 text-white'
                    }
                    defaultSize={defaultPanelSizes.area}
                  />
                  <ResizableHandle
                    withHandle
                    className={'border-2 border-teal-400'}
                  />
                  <ResizablePanel
                    className={
                      'flex text-sm flex-col justify-end items-center bg-neutral-300 font-mono'
                    }
                    id={'ground'}
                    defaultSize={defaultPanelSizes.ground}
                  />
                </ResizablePanelGroup>
              )}
            </div>

            {/* SLIDER */}
            <div className={'flex flex-col h-full '}>
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
            <div className={'flex flex-col text-right py-[1px] h-full'}>
              {range(23).map((number) => (
                <div
                  key={`zoom-graph-y-axis-${number}`}
                  className={'text-xs font-mono leading-[1.08]'}
                >
                  {number}
                </div>
              ))}
            </div>
          </div>

          {/* ZOOM */}
          <div className={'flex justify-end w-full font-mono'}>
            <div className={'flex flex-row'}>
              <span className={'font-bold'}>Zoom:&nbsp;</span>
              {displayedMapViewState.zoom}
            </div>
          </div>

          {/* KEY */}
          <div className={'text-sm text-center'}>
            <Label>KEY</Label>

            <div
              className={'w-full flex items-center justify-around gap-2  p-1'}
            >
              <div className={'bg-neutral-700 rounded  h-4 w-4 '} />
              <div className={'flex w-full justify-start'}>
                Upper: regional signs
              </div>
            </div>

            <div className={'flex w-full items-center gap-2 p-1'}>
              <div className={'bg-neutral-500 rounded  h-4 w-4 '} />
              <div className={'flex w-full justify-start'}>
                Middle: local signs
              </div>
            </div>
            <div className={'flex items-center gap-2 rounded-b p-1'}>
              <div className={'bg-neutral-300 rounded  h-4 w-4 '} />
              <div className={'flex w-full justify-start'}>
                Ground: pins, plans & routes
              </div>
            </div>
            <Separator />
            <div className={'flex items-center w-full justify-around py-1'}>
              <Label>Thresholds</Label>
              <div className={'flex items-center gap-1 bg-teal-400 p-1'}>
                <span className={'italic'}>Lower</span>
                <span className={''}>
                  {mapLabels.zoomThresholds[0].toFixed(2)}
                </span>
              </div>
              <div className={'flex items-center gap-1 bg-fuchsia-400 p-1'}>
                <span className={'italic'}>Upper</span>
                <span className={''}>
                  {mapLabels.zoomThresholds[1].toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PHONE */}
      <div className='flex flex-col items-center justify-center overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] w-[276px] h-[572px]'>
        {/* FAKE TOP BAR */}
        <MockupTopBar />

        {/* MAP CONTAINER */}
        <div className={'flex grow relative'}>
          <MockupMapSearchContainer colors={appColors} />
          <div
            className={
              'flex absolute z-50 bottom-1 border bg-neutral-50 py-1 px-2 rounded left-1 font-mono'
            }
          >
            Zoom level:
            {displayedMapViewState.zoom < mapLabels.zoomThresholds[1]
              ? 'Upper'
              : displayedMapViewState.zoom > mapLabels.zoomThresholds[0]
                ? 'Ground'
                : 'Middle'}
          </div>

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
                {isInAddLabelMode && <LabelMarker label={label} />}

                {/* EVENT LABEL(S) */}
                {displayedMapViewState.zoom < mapLabels.zoomThresholds[1] &&
                  mapLabels.labels[1].map(
                    (eventLabel: MapLabel, index: number) => {
                      return (
                        <LabelMarker
                          key={`sat-label-marker-${index}`}
                          label={eventLabel}
                        />
                      );
                    }
                  )}

                {/* AREA LABELS */}
                {displayedMapViewState.zoom > mapLabels.zoomThresholds[1] &&
                  displayedMapViewState.zoom < mapLabels.zoomThresholds[0] &&
                  mapLabels.labels[0].map(
                    (areaLabel: MapLabel, index: number) => {
                      return (
                        <LabelMarker
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

      {/* RIGHT SIDE  */}
      <div className={'flex flex-col justify-center gap-4 max-w-[340px]'}>
        {/* MAP CENTER */}
        <div className={'create-app-form-subcontainer gap-2'}>
          <div
            className={'flex flex-row items-center gap-2 justify-center w-full'}
          >
            <Target size={16} className={'text-red-400'} />
            <div className={'create-app-form-subtitle'}>Map center</div>
          </div>
          <div className={'text-xs '}>
            Drag the map to set it's center. When the map loads in the app, the map is zoomed in just below the <span className={'p-[2px] bg-teal-400'}>lower threshold</span> to display pins, plans, and routes.
          </div>
          <div className={'flex flex-row justify-around w-full text-sm'}>
            <div className={'flex flex-row'}>
              <span className={'italic'}>Lat:&nbsp;</span>
              {appDetails['Event latitude'] &&
                appDetails['Event latitude'].toFixed(3)}
            </div>
            <div className={'flex flex-row'}>
              <span className={'italic'}>Lng:&nbsp;</span>
              {appDetails['Event longitude'] &&
                appDetails['Event longitude'].toFixed(3)}
            </div>
          </div>
        </div>
        {/* CREATE LABEL FORM */}
        <div className={'create-app-form-subcontainer gap-2'}>
          <div className={'create-app-form-subtitle text-center'}>
            Create sign
          </div>

          <div className={'flex items-center gap-4 text-sm leading-[1.1]'}>
            <Label className={'w-16'}>Step 1&nbsp;</Label>
            <div>Click the map where you'd like to add a label.</div>
          </div>

          {/* {!isInAddLabelMode && (
            <div
              className={'leading-[1.2] text-sm border bg-red-100 rounded p-1'}
            ></div>
          )} */}

          <div className={'text-xs '}>
            {displayedMapViewState.zoom < mapLabels.zoomThresholds[1]
              ? 'This label will be added to the map at the Upper level. To add it to the Middle level, use the zoom slider in the left panel to zoom into the Middle level.'
              : displayedMapViewState.zoom > mapLabels.zoomThresholds[0]
                ? "Hold up! You can't add signs to the Ground level. Use the zoom slider in the left panel to zoom into the Upper or Middle level before adding a sign."
                : 'This label will be added to the map at the Middle level. To add it to the Upper level, use the zoom slider in the left panel to zoom into the Upper level.'}
          </div>

          <div className={'flex justify-around items-center text-sm'}>
            <div className={'flex gap-1'}>
              <span className={'italic'}>Lat: </span>
              {label.latitude?.toFixed(3) ?? 'N/A'}
            </div>
            <div className={'flex gap-1'}>
              <span className={'italic'}>Lng: </span>
              {label.longitude?.toFixed(3) ?? 'N/A'}
            </div>
          </div>

          <div className={'flex gap-2 items-center text-sm'}>
            <Label className={'w-24'}>Step 2</Label>
            <div className='w-40'>Add details</div>
            <Input
              name={'title'}
              onChange={handleTitleInput}
              disabled={!isInAddLabelMode}
              placeholder={'Sign text'}
              value={label.title}
              className='h-8 font-light text-center'
            />
          </div>
          <div className={'flex gap-2'}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant={'outline'}
                  className={'w-full h-8'}
                  disabled={!isInAddLabelMode}
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
                    'Icon'
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuGroup>{labelDropdownMenuGroup}</DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'outline'}
                  className={'w-full h-8'}
                  disabled={!isInAddLabelMode}
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
                    <div>Color</div>
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
                !isInAddLabelMode ||
                !label.icon ||
                !label.iconColor ||
                label.title?.length === 0
              }
            >
              Add label
            </Button>
            <Button
              className={'w-full'}
              variant={'destructive'}
              onClick={() => {
                setLabel({ title: '' });
                setIsInAddLabelMode(false);
              }}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Labels;
