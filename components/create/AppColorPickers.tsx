import React, { useState } from 'react';
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

export interface ConfigurableColor {
  name: string;
  note: string;
  hex: string;
}

export const AppColorPickers: React.FC<{}> = ({}) => {
  const [configurableColors, setConfigurableColors] = useState<{
    [configName: string]: ConfigurableColor;
  }>({
    primary: {
      name: 'Primary color',
      note: 'The main accent color of your app. Pick a dark, solid color.',
      hex: '#0017AB',
    },
    primaryContainer: {
      name: 'Main panel background',
      note: "Serves as a background color for some of the app's main panels. Pro tip: use a neutral or a light tone based on your primary color",
      hex: '#C9CCE0',
    },
    inversePrimary: {
      name: 'Primary accent',
      note: "An extra accent that's in the same tonal family as your primary",
      hex: '#4752AD',
    },
    secondary: {
      name: 'Secondary color',
      note: 'The secondary accent color of your app. Pick a dark, solid color.',
      hex: '#D64239',
    },
  });

  const handleChange = (
    hexColor: string,
    event: React.ChangeEvent,
    key: string
  ) => {
    setConfigurableColors({
      ...configurableColors,
      [key]: { ...configurableColors[key], hex: hexColor },
    });
  };

  const ColorPopovers = Object.entries(configurableColors).map(
    (entry: [string, ConfigurableColor], index: number) => {
      return (
        <Popover key={`color-popover-${index}`}>
          <PopoverTrigger asChild>
            <Button style={{ backgroundColor: entry[1].hex }}>
              {entry[1].name}
            </Button>
          </PopoverTrigger>
          <PopoverContent>
            <ColorPicker
              initialColor={entry[1].hex}
              onChangeComplete={(
                color: ColorResult,
                event: React.ChangeEvent
              ) => {
                handleChange(color.hex, event, entry[0]);
              }}
            />
          </PopoverContent>
        </Popover>
      );
    }
  );

  return (
    <div className={'flex flex-row w-full justify-around items-center gap-2'}>
      <div
        className={
          'flex flex-col items-center gap-4 p-4 bg-neutral-100 rounded border'
        }
      >
        <div className={'font-mono font-bold text-lg'}>Select Colors</div>
        <div className={'flex flex-col gap-3'}>{ColorPopovers}</div>
      </div>
      <div className={''}>
        <div className={'text-center font-mono font-bold mb-2'}>Map Page</div>
        <MapPage
          colors={{
            primary: configurableColors.primary.hex,
            primaryContainer: configurableColors.primaryContainer.hex,
            inversePrimary: configurableColors.inversePrimary.hex,
            secondary: configurableColors.secondary.hex,
          }}
        />
      </div>
      <div>
      <div className={'text-center font-mono font-bold mb-2'}>Feed Page</div>
        <FeedPage
          colors={{
            primary: configurableColors.primary.hex,
            primaryContainer: configurableColors.primaryContainer.hex,
            inversePrimary: configurableColors.inversePrimary.hex,
            secondary: configurableColors.secondary.hex,
          }}
        />
      </div>
    </div>
  );
};
