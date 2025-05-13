import React from 'react';
import {
  mdiDotsHorizontal,
  mdiSignal,
  mdiBattery40,
} from '@mdi/js';
import Icon from '@mdi/react';


const MockupTopBar: React.FC<{}> = ({}) => {
  return (
    <div className={'flex items-center justify-around top-1 h-10 w-full mx-4'}>
      <div className={'w-1/6 text-xs'}>2:59</div>
      <div className={'w-20 h-6 rounded-xl bg-neutral-800'} />
      <div className={'flex flex-row gap-2 w-1/6'}>
        <Icon path={mdiDotsHorizontal} size={1} />
        <Icon path={mdiSignal} size={1} />
        <Icon rotate={90} path={mdiBattery40} size={1} />
      </div>
    </div>
  );
};

export default MockupTopBar;