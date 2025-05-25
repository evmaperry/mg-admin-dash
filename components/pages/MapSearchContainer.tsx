import React from 'react'
import { Input } from '../ui/input'
import { AppColors } from 'mgtypes/types/App'
import { ChevronDown, Search } from 'lucide-react';

const MockupMapSearchContainer:React.FC<{colors:AppColors}>=({colors})=> {
  const {
    primary,
    primaryContainer,
    secondary,
    inversePrimary,
    onPrimaryContainerUnselected,
    outline,
    surfaceVariant,
  } = colors;

  const showMapFiltersButtonClassName = `text-[8px] font-bold bg-[${inversePrimary}] text-background`;

  return (
    <div
          className={
            'flex flex-col gap-1.5 p-2 justify-center items-center absolute mx-2 bg-neutral-50 z-50 rounded-xl top-2 left-0 right-0 border'
          }
          style={{ backgroundColor: primaryContainer, borderColor: outline }}
        >
          <div
            className={
              'flex flex-row items-center w-full justify-center gap-2 px-1'
            }
          >
            <Input
              placeholder='Search the map...'
              className={'w-full h-7 text-[10px]'}
            />
            <div
              style={{ backgroundColor: primary, borderColor: outline }}
              className={
                'flex items-center justify-center border rounded-full w-8 h-7 p-1'
              }
            >
              <Search size={14} color={'white'} />
            </div>
          </div>
          <div
            className={
              'flex flex-row justify-center rounded-lg items-center gap-2 w-48 h-5 border w-3/4 text-xs font-bold font-sans'
            }
            style={{ backgroundColor: inversePrimary }}
          >
            <ChevronDown size={16} className={'text-background'} />
            <span className={showMapFiltersButtonClassName}>
              SHOW MAP FILTERS
            </span>
          </div>
        </div>
  )
}

export default MockupMapSearchContainer;