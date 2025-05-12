import {
  Battery,
  ChevronDown,
  CirclePlus,
  Cog,
  Copy,
  Ellipsis,
  Info,
  MapPin,
  Search,
  Signal,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';

const FeedPage: React.FC<{
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    inversePrimary: string;
  };
}> = ({ colors }) => {
  const { primary, primaryContainer, secondary, inversePrimary } = colors;

  return (
    <div className='flex relative items-center justify-center overflow-hidden border-4 border-neutral-800 shadow rounded-[38px] pt-10 pb-16 w-[276px] h-[572px]'>
      {/* FAKE TOP BAR */}
      <div
        className={
          'absolute flex items-center justify-around top-1 h-10 w-full mx-4'
        }
      >
        <div className={'w-1/6 text-xs'}>2:59</div>
        <div className={'w-20 h-6 rounded-xl bg-neutral-800'} />
        <div className={'flex flex-row gap-2 w-1/6'}>
          <Ellipsis /> <Signal /> <Battery />
        </div>
      </div>

      <Image width={1200} height={900} alt={'Stock image contained in sample app for color configuration.'} src='https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1200'/>

      {/* BOTTOM NAV */}
      <div
        className={
          'absolute flex justify-around items-center w-full bottom-0 h-16 bg-neutral-50 text-black text-xs font-bold rounded-b-lg z-50'
        }
        style={{ backgroundColor: primaryContainer }}
      >
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center ml-2 p-1.5'}
        >
          <Copy color={primary} size={24} />
          <p style={{ color: primary }}>HOME</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center p-1.5'}
        >
          <MapPin size={24} />
          <p>MAP</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center p-1.5'}
        >
          <Info size={24} />
          <p>HELP</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center p-1.5'}
        >
          <Cog size={24} />
          <p>INFO</p>
        </div>
        <div
          style={{ color: '#767A81' }}
          className={'flex flex-col items-center mr-2 p-1.5'}
        >
          <CirclePlus size={24} />
          <p>POST</p>
        </div>
      </div>
    </div>
  );
};

export default FeedPage;
