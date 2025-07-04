'use client';
import React, { useState, useEffect } from 'react';
import ColorPicker from '../../color-picker';
import MapPage from '../../pages/MapPage';
import FeedPage from '../../pages/FeedPage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../../ui/button';
import { ColorResult } from 'react-color';
import { useCreateAppStore } from '@/providers/create-app-provider';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../../ui/select';
import { Info } from 'lucide-react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '../../ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { Label } from '@/components/ui/label';

export interface IConfigurableColor {
  name: string;
  note: string;
  hex: string;
}
export const Colors: React.FC<{}> = ({}) => {
  const { appColors, setAppColors, mapTheme, setMapTheme } = useCreateAppStore(
    (state) => state
  );

  const [configurableColors, setConfigurableColors] = useState<{
    [configName: string]: IConfigurableColor;
  }>({
    primary: {
      name: 'Primary',
      note: 'The main accent color of your app, which will be displayed as backgrounds and title text. Pick a dark, solid color.',
      hex: appColors.primary,
    },
    inversePrimary: {
      name: 'Primary accent',
      note: "Select an extra accent that's in the same tonal family as your primary color.",
      hex: appColors.inversePrimary,
    },
    primaryContainer: {
      name: 'Panel background',
      note: "Serves as a background color for some of the app's main panels. Pro tip: use a neutral or a light tone based on your primary color",
      hex: appColors.primaryContainer,
    },
    onPrimaryContainer: {
      name: 'Nav selected',
      note: 'Indicates that a navigation option is selected, and also serves as a body text color on colored panels.',
      hex: appColors.onPrimaryContainer,
    },
    onPrimaryContainerUnselected: {
      name: 'Nav unselected',
      note: 'Indicates that a navigation option is not selected.',
      hex: appColors.onPrimaryContainerUnselected,
    },
    secondary: {
      name: 'Secondary',
      note: 'The secondary accent color of your app. Pick a dark, solid color.',
      hex: appColors.secondary,
    },
    surfaceVariant: {
      name: 'Neutral',
      note: 'A neutral color used for button backgrounds; use in conjunction with the Outline color',
      hex: appColors.surfaceVariant,
    },
    outline: {
      name: 'Outline',
      note: 'The border color of buttons and other elements.',
      hex: appColors.outline,
    },
  });

  // set app colors when app is selected
  useEffect(() => {
    setConfigurableColors({
      primary: {
        ...configurableColors.primary,
        hex: appColors.primary,
      },
      inversePrimary: {
        ...configurableColors.inversePrimary,
        hex: appColors.inversePrimary,
      },
      primaryContainer: {
        ...configurableColors.primaryContainer,
        hex: appColors.primaryContainer,
      },
      onPrimaryContainer: {
        ...configurableColors.onPrimaryContainer,
        hex: appColors.onPrimaryContainer,
      },
      onPrimaryContainerUnselected: {
        ...configurableColors.onPrimaryContainerUnselected,
        hex: appColors.onPrimaryContainerUnselected,
      },
      secondary: {
        ...configurableColors.secondary,
        hex: appColors.secondary,
      },
      surfaceVariant: {
        ...configurableColors.surfaceVariant,
        hex: appColors.surfaceVariant,
      },
      outline: {
        ...configurableColors.outline,
        hex: appColors.outline,
      },
    });
  }, [appColors]);

  const handleColorChange = (
    hexColor: string,
    event: React.ChangeEvent,
    key: string
  ) => {
    // Local state
    setConfigurableColors({
      ...configurableColors,
      [key]: { ...configurableColors[key], hex: hexColor },
    });
    // App config store
    // will send just hex to server to configure app
    setAppColors({ [key]: hexColor });
  };

  const ColorPopovers = Object.entries(configurableColors).map(
    (entry: [string, IConfigurableColor], index: number) => {
      return (
        <div
          key={`color-popover-${index}`}
          className={'flex flex-row items-center justify-between gap-6'}
        >
          <div className={'flex flex-col'}>
            <Label>{entry[1].name}</Label>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant={'outline'} className={'font-mono flex gap-2'}>
                <div
                  className={'h-6 w-6 rounded'}
                  style={{ backgroundColor: entry[1].hex }}
                />
                {entry[1].hex}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              side='right'
              align='center'
              className={'w-full flex flex-col items-center gap-5 w-[650px]'}
            >
              <div className={'font-mono font-bold'}>{entry[1].name}</div>
              <div className={'leading-[1.1]'}>{entry[1].note}</div>
              <div>
                <ColorPicker
                  initialColor={entry[1].hex}
                  onChangeComplete={(
                    color: ColorResult,
                    event: React.ChangeEvent
                  ) => {
                    handleColorChange(color.hex, event, entry[0]);
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      );
    }
  );

  return (
    <div
      className={
        'flex flex-row items-center justify-around w-full xl:px-20 2xl:px-36'
      }
    >
      {/* PAGES CAROUSEL */}
      <div className={'border p-2 rounded shadow'}>
        <Carousel
          opts={{ align: 'start', loop: true }}
          className={'px-12 pb-4 pt-2 w-[420px]'}
          plugins={[
            Autoplay({
              delay: 10000,
            }),
          ]}
        >
          <CarouselContent className={''}>
            <CarouselItem className={'flex flex-col items-center gap-3'}>
              <div className={'create-app-form-subtitle'}>Feed page</div>
              <FeedPage
                colors={{
                  primary: configurableColors.primary.hex,
                  primaryContainer: configurableColors.primaryContainer.hex,
                  onPrimaryContainer: configurableColors.onPrimaryContainer.hex,
                  onPrimaryContainerUnselected:
                    configurableColors.onPrimaryContainerUnselected.hex,
                  inversePrimary: configurableColors.inversePrimary.hex,
                  secondary: configurableColors.secondary.hex,
                  outline: configurableColors.outline.hex,
                  surfaceVariant: configurableColors.surfaceVariant.hex,
                }}
              />
            </CarouselItem>
            <CarouselItem className={'flex flex-col items-center gap-3'}>
              <div className={'create-app-form-subtitle'}>Map page</div>
              <MapPage
                colors={{
                  primary: configurableColors.primary.hex,
                  primaryContainer: configurableColors.primaryContainer.hex,
                  onPrimaryContainer: configurableColors.onPrimaryContainer.hex,
                  onPrimaryContainerUnselected:
                    configurableColors.onPrimaryContainerUnselected.hex,

                  inversePrimary: configurableColors.inversePrimary.hex,
                  secondary: configurableColors.secondary.hex,
                  outline: configurableColors.outline.hex,
                  surfaceVariant: configurableColors.surfaceVariant.hex,
                }}
              />
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious className={'ml-16'} />
          <CarouselNext className={'mr-16'} />
        </Carousel>
      </div>

      {/* COLOR PANEL */}
      <div className={'create-app-form-container px-8'}>
        <div className={'flex flex-col justify-around items-center gap-2'}>
          <div className={'create-app-form-subcontainer px-8'}>
            <div className={'create-app-form-subtitle w-full text-center'}>
              Brand colors
            </div>

            <div className={'flex flex-col gap-3'}>{ColorPopovers}</div>
          </div>

          <div
            className={
              'create-app-form-subcontainer w-full flex-row items-center px-8'
            }
          >
            <Label className={'w-1/2'}>Map theme</Label>
            <Select
              onValueChange={(
                value: 'light' | 'streets' | 'dark' | 'outdoors'
              ) => {
                setMapTheme(value);
              }}
            >
              <SelectTrigger className={'w-1/2'}>
                <SelectValue placeholder={'Light'} defaultValue={mapTheme} />
              </SelectTrigger>

              <SelectContent>
                <SelectGroup>
                  <SelectItem value={'light'}>Light</SelectItem>
                  <SelectItem value={'dark'}>Dark</SelectItem>
                  <SelectItem value={'outdoors'}>Outdoors</SelectItem>
                  <SelectItem value={'streets'}>Streets</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
