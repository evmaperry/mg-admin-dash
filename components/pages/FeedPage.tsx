import {
  Apple,
  Battery,
  ChevronDown,
  CirclePlus,
  Cog,
  Copy,
  Ellipsis,
  Info,
  InfoIcon,
  MapPin,
  Search,
  Signal,
  Signpost,
  ThumbsDown,
  ThumbsUp,
} from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import balloonsHeader from '../../lib/header-balloons.jpg';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';

const FeedPage: React.FC<{
  colors: {
    primary: string;
    primaryContainer: string;
    secondary: string;
    inversePrimary: string;
  };
}> = ({ colors }) => {
  const { primary, primaryContainer, secondary, inversePrimary } = colors;

  console.log('prmiaryContainer', primaryContainer);
  return (
    <div className='flex flex-col items-center justify-start overflow-hidden border-4 border-neutral-800 shadow rounded-[38px] w-[276px] h-[572px]'>
      {/* FAKE TOP BAR */}
      <div
        className={'flex items-center justify-around top-1 h-10 w-full mx-4'}
      >
        <div className={'w-1/6 text-xs'}>2:59</div>
        <div className={'w-20 h-6 rounded-xl bg-neutral-800'} />
        <div className={'flex flex-row gap-2 w-1/6'}>
          <Ellipsis /> <Signal /> <Battery />
        </div>
      </div>
      {/* HEADER */}
      <div className={'flex h-1/4 relative'}>
        <div
          className={
            'absolute top-1 left-1 font-bold text-base text-neutral-50'
          }
        >
          EventName+
        </div>
        <Image
          style={{ objectFit: 'cover' }}
          width={1200}
          height={900}
          alt={'Stock image contained in sample app for color configuration.'}
          src={balloonsHeader}
        />
      </div>

      {/* SEARCH BAR / TABS */}
      <div
        style={{ backgroundColor: primaryContainer }}
        className={'flex flex-col  justify-center w-full pt-2 gap-2 '}
      >
        {/* Search */}
        <div
          className={
            'flex flex-row items-center w-full justify-center gap-2 px-3'
          }
        >
          <Input
            placeholder='Search the map...'
            className={'w-full h-7 text-[10px]'}
          />
          <Search
            className={'border rounded-full w-8 h-7'}
            size={26}
            style={{ backgroundColor: primary }}
            color={'white'}
          />
        </div>
        <div className={'flex flex-row w-full text-[10px]'}>
          <div
            className={
              'flex w-1/4 font-bold justify-center border-t border-r py-1.5 bg-background'
            }
            style={{ borderColor: '#767A81' }}
          >
            MAIN
          </div>
          <div
            className={'flex w-1/4 font-bold justify-center border-r py-1.5'}
            style={{ color: '#767A81', borderColor: '#767A81' }}
          >
            ARCHIVE
          </div>
          <div
            className={'flex w-1/4 font-bold justify-center border-r py-1.5'}
            style={{ color: '#767A81', borderColor: '#767A81' }}
          >
            MINE
          </div>
          <div
            className={'flex w-1/4  font-bold justify-center py-1.5'}
            style={{ color: '#767A81', borderColor: '#767A81' }}
          >
            FRIENDS
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className={'p-2 h-[242px] w-full overflow-scroll'}>
        {/* USE SEARCH BOX */}
        <div
          className={
            'flex h-8 items-center rounded-md justify-center text-[8px] text-background'
          }
          style={{ backgroundColor: secondary }}
        >
          Looking for something? Use the search bar ☝️
        </div>
        {/* CARD */}
        <div className={'h-[240px] px-3 py-1 mt-2 border w-full rounded-lg'}>
          {/* AVATAR */}
          <div
            className={'flex flex-row justify-between h-11 w-full items-center'}
          >
            <div className={'flex gap-2 items-center'}>
              <Apple
                size={28}
                style={{
                  backgroundColor: 'coral',
                  padding: 2,
                  borderRadius: 20,
                }}
              />
              <div className={'flex flex-col leading-[1.2] text-[9px]'}>
                <div>Event organizer's post</div>
                <div>created 2 hours ago</div>
              </div>
            </div>
            <Signpost size={24} />
          </div>

          {/* TEXT */}
          <div className={'flex flex-col'}>
            <div className={'font-light text-lg'}>Opening Fireworks</div>
            <div className={'flex flex-row items-center justify-between'}>
              <div
                className={'text-[9px] font-bold tracking-[.7px]'}
                style={{ color: primary }}
              >
                STARTS IN 5 HOURS
              </div>
              <div className={'flex items-center gap-1'}>
                <div className={'text-[9px]'}>RSVP: No </div>
                <Switch className={'w-9'} />
                <div className={'text-[9px]'}>Yes</div>
              </div>
            </div>
          </div>
          {/* IMAGE */}
          
          {/* ACTIONS */}
          <div className={'flex flex-row items-center justify-between'}>
            {/* VOTES */}
            <div className={'flex flex-row gap-2 items-center'}>
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow'
                }
              >
                <ThumbsDown color={'rgb(198, 62, 62)'} size={16} />
              </div>

              <div>2</div>
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow'
                }
              >
                <ThumbsUp color={'rgb(48, 162, 138)'} size={16} />
              </div>
            </div>
            {/* BUTTONS */}
            <div className={'flex gap-2'}>
              {' '}
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow'
                }
              >
                <InfoIcon size={16} />
              </div>
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow'
                }
              >
                <Ellipsis size={16} />
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM NAV */}
        <div
          className={
            'flex justify-around items-center w-full bottom-0 h-16 bg-neutral-50 text-black text-xs font-bold rounded-b-lg z-50'
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
    </div>
  );
};

export default FeedPage;
