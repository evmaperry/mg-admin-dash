import React from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { cn } from '@/lib/utils';
dayjs.extend(customParseFormat);

const DatePicker: React.FC<{
 // isTextMuted: boolean;
  onSelect: (value: any) => void;
  selectedDateString: string | undefined;
  hint: string;
  triggerClassName:string
}> = ({
  // isTextMuted,
  onSelect, selectedDateString, hint, triggerClassName }) => {
  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          'gap-2',
          'flex h-10 items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background data-[placeholder]:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 [&>span]:line-clamp-1',
         // isTextMuted && 'text-muted-foreground',
          triggerClassName
        )}
      >
        <CalendarIcon className='h-8 w-8' />
        <div className='flex justify-between items-center w-full'>
          {selectedDateString ? (
            dayjs(selectedDateString).format('ddd, MMM D')
          ) : (
            <span>{hint}</span>
          )}
          <ChevronDown className='h-4 w-4 opacity-50' />
        </div>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0' align='start'>
        <Calendar
          mode='single'
          selected={
            selectedDateString ? new Date(selectedDateString) : undefined
          }
          onSelect={(value:Date|undefined) => {
            onSelect(value as Date);
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
