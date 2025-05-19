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
import fireworksImage from '../../lib/header-fireworks-2.jpg';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import Icon from '@mdi/react';
import {
  mdiAccount,
  mdiDotsHorizontal,
  mdiSignal,
  mdiBattery40,
  mdiMagnify,
  mdiCalendar,
  mdiThumbUp,
  mdiThumbDown,
} from '@mdi/js';
import MockupBottomNav from './BottomNav';
import { IAppColors } from 'mgtypes/types/App'
import MockupTopBar from './TopBar';

const FeedPage: React.FC<{
  colors: IAppColors;
}> = ({ colors }) => {
  const {
    primary,
    primaryContainer,
    secondary,
    inversePrimary,
    onPrimaryContainer,
    onPrimaryContainerUnselected,
    outline,
    surfaceVariant,
  } = colors;

  return (
    <div className='flex flex-col items-center justify-start overflow-hidden border-4 border-neutral-800 shadow-lg rounded-[38px] w-[276px] h-[572px]'>
      {/* FAKE TOP BAR */}
      <MockupTopBar />
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
          alt={
            'Stock header image contained in app mock-up used for color configuration.'
          }
          src={balloonsHeader}
        />
      </div>

      {/* SEARCH BAR / TABS */}
      <div
        style={{ backgroundColor: primaryContainer }}
        className={'flex flex-col  justify-center w-full pt-2 gap-2 '}
      >
        {/* SEARCH */}
        <div
          className={
            'flex flex-row items-center w-full justify-center gap-2 px-3'
          }
        >
          <Input
            placeholder='Search the map...'
            className={'w-full h-7 text-[10px]'}
          />
          <div
            style={{ backgroundColor: primary, borderColor: outline }}
            className={
              'flex items-center justify-center border rounded-full w-8 h-8 p-1'
            }
          >
            <Icon path={mdiMagnify} size={1} color={'white'} />
          </div>
        </div>
        {/* TABS */}
        <div className={'flex flex-row w-full text-[10px]'}>
          <div
            className={
              'flex w-1/4 font-bold justify-center border-t border-r py-1.5 bg-background'
            }
            style={{ borderColor: outline, color: onPrimaryContainer }}
          >
            MAIN
          </div>
          <div
            className={
              'flex w-1/4 font-bold justify-center border-r border-b py-1.5'
            }
            style={{
              color: onPrimaryContainerUnselected,
              borderColor: outline,
            }}
          >
            ARCHIVE
          </div>
          <div
            className={
              'flex w-1/4 font-bold justify-center border-r border-b py-1.5'
            }
            style={{
              color: onPrimaryContainerUnselected,
              borderColor: outline,
            }}
          >
            MINE
          </div>
          <div
            className={'flex w-1/4  font-bold justify-center border-b py-1.5'}
            style={{
              color: onPrimaryContainerUnselected,
              borderColor: outline,
            }}
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
        <div className={'h-[304px] px-3 py-1 mt-2 border w-full rounded-lg'}>
          {/* AVATAR */}
          <div
            className={'flex flex-row justify-between h-11 w-full items-center'}
          >
            <div className={'flex gap-2 items-center w-full'}>
              <div
                className={
                  'bg-orange-300 flex p-1 rounded-full items-center justify-center w-9 h-9 border'
                }
              >
                <Apple color={'white'} size={28} />
              </div>
              <div className={'flex flex-col leading-[1.2] text-[9px]'}>
                <div>Event organizer's plans</div>
                <div>made 2 hours ago</div>
              </div>
            </div>
            <Icon path={mdiCalendar} size={1} />
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
          <div className={'flex mt-1.5 mb-2 h-30 rounded overflow-hidden'}>
            <Image
              style={{ objectFit: 'cover' }}
              height={900}
              width={600}
              src={fireworksImage}
              alt={
                'Stock content image contained in app mock-up used for color configuration.'
              }
            />
          </div>
          {/* ACTIONS */}
          <div className={'flex flex-row items-center justify-between'}>
            {/* VOTES */}
            <div className={'flex flex-row gap-1 items-center'}>
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow p-1.5'
                }
                style={{ backgroundColor: surfaceVariant }}
              >
                <Icon path={mdiThumbDown} size={1} color={'rgb(198, 62, 62)'} />
              </div>

              <div>2</div>
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow p-1.5'
                }
                style={{ backgroundColor: primary }}
              >
                <Icon path={mdiThumbUp} size={1} color={'rgb(48, 162, 138)'} />
              </div>
            </div>
            {/* BUTTONS */}
            <div className={'flex gap-2'}>
              {' '}
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow'
                }
                style={{ backgroundColor: surfaceVariant }}
              >
                <InfoIcon size={16} color={primary} />
              </div>
              <div
                className={
                  'flex items-center justify-center border rounded-full h-7 w-7 shadow'
                }
                style={{ backgroundColor: surfaceVariant }}
              >
                <Ellipsis size={16} color={primary} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* BOTTOM NAV */}
      <MockupBottomNav colors={colors} page={'feed'} />
    </div>
  );
};

export default FeedPage;
