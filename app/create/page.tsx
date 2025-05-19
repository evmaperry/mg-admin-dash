import { Button } from '@/components/ui/button';
import React, { useState, useRef, useEffect } from 'react';
import 'mapbox-gl/dist/mapbox-gl.css';
import CenterMapDialog from '@/components/create/CenterMapDialog';
import AppDetailInputs from '@/components/create/AppDetailInputs';
import { AppColorPickers } from '@/components/create/AppColorPickers';
import AddMarkersMap from '@/components/create/AddMarkersMap';
import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import AppSelect from '@/components/create/AppSelect';

const CreatePage: React.FC<{}> = async ({}) => {
  // const [eventDates, setEventDates] = useState<{
  //   start: Date | undefined;
  //   end: Date | undefined;
  // }>({ start: undefined, end: undefined });

  // const [eventTimes, setEventTimes] = useState<{
  //   start: string;
  //   end: string;
  // }>({
  //   start: '',
  //   end: '',
  // });

  // const [eventColors, setEventColors] = useState<{
  //   success: string;
  //   warning: string;
  //   warningUnselected: string;
  //   locationPuck: string;
  //   primaryVariant: string;
  //   primaryContainerDark: string;
  //   primaryContainerDarker: string;
  //   paperThemeColors: {
  //     primary: string;
  //     onPrimary: string;
  //     primaryContainer: string;
  //     onPrimaryContainer: string;
  //     secondary: string;
  //     onSecondary: string;
  //     secondaryContainer: string;
  //     onSecondaryContainer: string;
  //     tertiary: string;
  //     onTertiary: string;
  //     tertiaryContainer: string;
  //     onTertiaryContainer: string;
  //     error: string;
  //     onError: string;
  //     errorContainer: string;
  //     onErrorContainer: string;
  //     background: string;
  //     onBackground: string;
  //     surface: string;
  //     onSurface: string;
  //     surfaceVariant: string;
  //     onSurfaceVariant: string;
  //     outline: string;
  //     outlineVariant: string;
  //     shadow: string;
  //     scrim: string;
  //     inverseSurface: string;
  //     inverseOnSurface: string;
  //     inversePrimary: string;
  //     elevation: {
  //       level0: string;
  //       level1: string;
  //       level2: string;
  //       level3: string;
  //       level4: string;
  //       level5: string;
  //     };
  //     surfaceDisabled: string;
  //     onSurfaceDisabled: string;
  //     backdrop: string;
  //   };
  // }>({
  //   success: '#30A28A',
  //   warning: '#C63E3E',
  //   warningUnselected: '#C76767',
  //   locationPuck: '#1A68FF',
  //   primaryVariant: '#082A59',
  //   primaryContainerDark: 'rgb(183, 185, 248)',
  //   primaryContainerDarker: 'rgb(177, 180, 255)',
  //   paperThemeColors: {
  //     primary: 'rgb(71, 85, 182)',
  //     onPrimary: 'rgb(255, 255, 255)',
  //     primaryContainer: 'rgb(223, 224, 255)',
  //     onPrimaryContainer: 'rgb(0, 13, 95)',
  //     secondary: 'rgb(176, 46, 0)',
  //     onSecondary: 'rgb(255, 255, 255)',
  //     secondaryContainer: 'rgb(255, 219, 209)',
  //     onSecondaryContainer: 'rgb(59, 9, 0)',
  //     tertiary: 'rgb(0, 103, 131)',
  //     onTertiary: 'rgb(255, 255, 255)',
  //     tertiaryContainer: 'rgb(188, 233, 255)',
  //     onTertiaryContainer: 'rgb(0, 31, 42)',
  //     error: 'rgb(186, 26, 26)',
  //     onError: 'rgb(255, 255, 255)',
  //     errorContainer: 'rgb(255, 218, 214)',
  //     onErrorContainer: 'rgb(65, 0, 2)',
  //     background: 'rgb(255, 251, 255)',
  //     onBackground: 'rgb(27, 27, 31)',
  //     surface: 'rgb(255, 251, 255)',
  //     onSurface: 'rgb(27, 27, 31)',
  //     surfaceVariant: 'rgb(227, 225, 236)',
  //     onSurfaceVariant: 'rgb(70, 70, 79)',
  //     outline: 'rgb(118, 118, 128)',
  //     outlineVariant: 'rgb(199, 197, 208)',
  //     shadow: 'rgb(0, 0, 0)',
  //     scrim: 'rgb(0, 0, 0)',
  //     inverseSurface: 'rgb(48, 48, 52)',
  //     inverseOnSurface: 'rgb(243, 240, 244)',
  //     inversePrimary: 'rgb(187, 195, 255)',
  //     elevation: {
  //       level0: 'transparent',
  //       level1: 'rgb(246, 243, 251)',
  //       level2: 'rgb(240, 238, 249)',
  //       level3: 'rgb(235, 233, 247)',
  //       level4: 'rgb(233, 231, 246)',
  //       level5: 'rgb(229, 228, 245)',
  //     },
  //     surfaceDisabled: 'rgba(27, 27, 31, 0.12)',
  //     onSurfaceDisabled: 'rgba(27, 27, 31, 0.38)',
  //     backdrop: 'rgba(47, 48, 56, 0.4)',
  //   },
  // });

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect('/sign-in');
  }

  return (
    <div className={'flex flex-col gap-8 max-w-6xl w-full'}>
      <div className={'flex flex-row'}>
        <div className={'text-3xl font-mono'}>Build an app</div>
        <AppSelect user={user} />
      </div>
      <div className={'flex flex-col gap-3 w-full'}>
        <div className={'create-event-form-title'}>The basics</div>
        <AppDetailInputs />
      </div>

      <div className={'flex flex-row gap-6 items-center w-[500px]'}>
        <div className={'create-event-form-title'}>Map specs</div>
        <CenterMapDialog />
      </div>

      <div className={'flex flex-col gap-3'}>
        <div className={'create-event-form-title'}>Colors</div>
        <AppColorPickers />
      </div>

      <div className={'flex flex-col gap-3'}>
        <div className={'create-event-form-title'}>Add Markers to Your Map</div>
        <AddMarkersMap user={user} />
      </div>

      {/* Save & Create */}
      <div className={'flex flex-row justify-center gap-3'}>
        <Button>Save</Button>
        <Button>Create</Button>
      </div>
    </div>
  );
};

export default CreatePage;
