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

// the hex values for each colors that get passed to mockup map and
// feed pages
export interface IAppColors {
  primary: string;
  primaryContainer: string;
  onPrimaryContainer: string;
  onPrimaryContainerUnselected: string;
  inversePrimary: string;
  secondary: string;
  outline: string;
}

export const AppColorPickers: React.FC<{}> = ({}) => {
  const [configurableColors, setConfigurableColors] = useState<{
    [configName: string]: ConfigurableColor;
  }>({
    primary: {
      name: 'Primary',
      note: 'The main accent color of your app, which will be displayed as backgrounds and title text. Pick a dark, solid color.',
      hex: '#1a237e',
    },
    inversePrimary: {
      name: 'Primary accent',
      note: "Select an extra accent that's in the same tonal family as your primary color.",
      hex: '#3f51b5',
    },
    primaryContainer: {
      name: 'Panel background',
      note: "Serves as a background color for some of the app's main panels. Pro tip: use a neutral or a light tone based on your primary color",
      hex: '#c5cae9',
    },
    onPrimaryContainer: {
      name: 'Nav selected',
      note: 'Indicates that a navigation option is selected, and also serves as a body text color on colored panels.',
      hex: '#1a237e',
    },
    onPrimaryContainerUnselected: {
      name: 'Nav unselected',
      note: 'Indicates that a navigation option is not selected.',
      hex: '#7986cb',
    },
    secondary: {
      name: 'Secondary',
      note: 'The secondary accent color of your app. Pick a dark, solid color.',
      hex: '#D64239',
    },
    outline: {
      name: 'Outline',
      note: 'The border color of buttons and other elements.',
      hex: '#607d8b',
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
                style={{ backgroundColor: entry[1].hex }}
                className={'text-sm'}
              >
                {entry[1].hex}
              </Button>
            </PopoverTrigger>
            <PopoverContent
              className={'flex flex-col items-center gap-5 w-96 '}
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
                    handleChange(color.hex, event, entry[0]);
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
            onPrimaryContainer: configurableColors.onPrimaryContainer.hex,
            onPrimaryContainerUnselected:
              configurableColors.onPrimaryContainerUnselected.hex,

            inversePrimary: configurableColors.inversePrimary.hex,
            secondary: configurableColors.secondary.hex,
            outline: configurableColors.outline.hex
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
            outline: configurableColors.outline.hex
          }}
        />
      </div>
    </div>
  );
};
