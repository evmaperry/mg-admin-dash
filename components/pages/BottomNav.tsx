import React from 'react';
import Icon from '@mdi/react';
import {
  mdiAlertBox,
  mdiCog,
  mdiContentCopy,
  mdiMapMarker,
  mdiPlusCircle,
} from '@mdi/js';
import {IAppColors} from 'mgtypes/types/App'

const MockupBottomNav: React.FC<{
  colors: IAppColors;
  page: 'map' | 'feed';
}> = ({ colors, page }) => {
  const {
    primary,
    primaryContainer,
    secondary,
    inversePrimary,
    onPrimaryContainer,
    onPrimaryContainerUnselected,
  } = colors;

  console.log('page', page)
  return (
    <div
      className={
        'flex justify-around items-center w-full bottom-0 h-16 text-black text-[10px] font-bold rounded-b-lg z-50'
      }
      style={{ backgroundColor: primaryContainer }}
    >
      <div
        style={{ color: page === 'feed' ? onPrimaryContainer : onPrimaryContainerUnselected }}
        className={'flex flex-col items-center ml-2 p-1.5'}
      >
        <Icon path={mdiContentCopy} rotate={270} size={1}  />
        <p>FEED</p>
      </div>
      <div
        style={{ color: page === 'map' ? onPrimaryContainer : onPrimaryContainerUnselected }}
        className={'flex flex-col items-center p-1.5'}
      >
        <Icon path={mdiMapMarker} size={1} />
        <p>MAP</p>
      </div>
      <div
        style={{ color: onPrimaryContainerUnselected }}
        className={'flex flex-col items-center p-1.5'}
      >
        <Icon path={mdiAlertBox} size={1} />
        <p>HELP</p>
      </div>
      <div
        style={{ color: onPrimaryContainerUnselected }}
        className={'flex flex-col items-center p-1.5'}
      >
        <Icon path={mdiCog} size={1} />
        <p>INFO</p>
      </div>
      <div
        style={{ color: onPrimaryContainerUnselected }}
        className={'flex flex-col items-center mr-2 p-1.5'}
      >
        <Icon path={mdiPlusCircle} size={1} />
        <p>POST</p>
      </div>
    </div>
  );
};

export default MockupBottomNav;
