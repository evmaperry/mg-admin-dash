'use client'
import React, { useState, useEffect } from 'react';
import ColorPicker from './ColorPicker';
import MapPage from '../pages/MapPage';
import FeedPage from '../pages/FeedPage';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '../ui/button';
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
} from '../ui/select';
export interface IConfigurableColor {
  name: string;
  note: string;
  hex: string;
}
export const AppColorPickers: React.FC<{}> = ({}) => {
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
  useEffect(()=> {
    setConfigurableColors({
      primary: {
        ...configurableColors.primary,
        hex: appColors.primary
      },
       inversePrimary: {
        ...configurableColors.inversePrimary,
        hex: appColors.inversePrimary
      },
       primaryContainer: {
        ...configurableColors.primaryContainer,
        hex: appColors.primaryContainer
      },
       onPrimaryContainer: {
        ...configurableColors.onPrimaryContainer,
        hex: appColors.onPrimaryContainer
      },
      onPrimaryContainerUnselected: {
        ...configurableColors.onPrimaryContainerUnselected,
        hex: appColors.onPrimaryContainerUnselected
      },
      secondary: {
        ...configurableColors.secondary,
        hex: appColors.secondary
      },
      surfaceVariant: {
        ...configurableColors.surfaceVariant,
        hex: appColors.surfaceVariant
      },
      outline: {
        ...configurableColors.outline,
        hex: appColors.outline
      },

    })



  }, [appColors])

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
          className={'flex flex-row items-center justify-between gap-8'}
        >
          <div className={'flex flex-col'}>
            <div className={'font-mono font-bold'}>{entry[1].name}</div>
            <div className={'font-light'}>( {entry[0]} )</div>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={'outline'}
                className={'text-sm font-mono flex gap-2'}
              >
                <div
                  className={'h-6 w-6 rounded'}
                  style={{ backgroundColor: entry[1].hex }}
                />
                {entry[1].hex}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={'flex flex-col items-center gap-5 w-[650px] '}
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

  console.log('appColors from pickers', appColors)
  return (
    <div className={'flex flex-row w-full justify-around items-center gap-2'}>
      <div
        className={
          'flex flex-col items-center gap-4 p-4 bg-neutral-100 rounded border'
        }
      >
        <div className={'flex flex-col items-center gap-1'}>
          <div className={'text-sm font-bold text-sky-500'}>
            CLICK THE SWATCHES TO CHANGE COLORS <span className={'text-lg'}>👇</span>
          </div>
        </div>
        <div className={'flex flex-col gap-3'}>{ColorPopovers}</div>
        <div className={'flex flex-row items-center gap-6 w-full'}>
          <div className={'font-mono font-bold text-md w-1/2'}>Select Map Theme</div>
          <Select
            onValueChange={(
              value: 'light-v11' | 'streets-v12' | 'dark-v11' | 'outdoors-v12'
            ) => {
              setMapTheme(value);
            }}
          >
            <SelectTrigger className={'w-1/2'}>
              <SelectValue placeholder={'Light'} />
            </SelectTrigger>

            <SelectContent>
              <SelectGroup>
                <SelectItem value={'light-v11'}>Light</SelectItem>
                <SelectItem value={'dark-v11'}>Dark</SelectItem>
                <SelectItem value={'outdoors-v12'}>Outdoors</SelectItem>
                <SelectItem value={'streets-v12'}>Streets</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className={''}>
        <div className={'font-mono font-bold text-center mb-2'}>Map Page</div>
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
      </div>
      <div>
        <div className={'text-center font-mono font-bold mb-2'}>Feed Page</div>
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
      </div>
    </div>
  );
};
