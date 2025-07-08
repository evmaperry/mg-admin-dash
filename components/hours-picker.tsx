import React, { useState } from 'react';
import { Button } from './ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import {
  AlarmClock,
  AlarmClockPlus,
  CalendarClock,
  CalendarIcon,
} from 'lucide-react';
import { Calendar } from './ui/calendar';
import TimePicker from './time-picker';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import dayjs from 'dayjs';
import { Label } from './ui/label';

export interface HourInputs {
  startDate: string | undefined;
  startTime: string | undefined;
  endDate: string | undefined;
  endTime: string | undefined;
}

const HoursPicker: React.FC<{ hoursBundle: { hours: any; setHours: any } }> = ({
  hoursBundle,
}) => {
  const { hours, setHours } = hoursBundle;

  const [hour, setHour] = useState<HourInputs>({
    startDate: undefined,
    startTime: undefined,
    endDate: undefined,
    endTime: undefined,
  });

  const handleAddPinHour = () => {
    // TODO: add form validation
    setHours([...hours, hour]);
    setHour({
      startDate: undefined,
      startTime: undefined,
      endDate: undefined,
      endTime: undefined,
    });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant={'outline'} className={'font-light h-8 w-48 mx-auto'}>
          Add hours
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align='start'
        side='left'
        className={'flex w-[600px] grow'}
      >
        <div className={'flex flex-col items-center w-full gap-4'}>
          <div
            className={'flex flex-row items-center gap-4 w-full justify-around'}
          >
            <div className={'flex flex-col gap-1'}>
              <div
                className={
                  'flex flex-row items-center w-full justify-start gap-6'
                }
              >
                <Label>Opens</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[160px] justify-start text-left font-normal',
                        !hour['startDate'] && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className={'mr-2'} />
                      {hour['startDate'] ? (
                        dayjs(hour['startDate']).format('ddd, MMM D')
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={
                        hour['startDate']
                          ? new Date(hour['startDate'])
                          : undefined
                      }
                      onSelect={(value) => {
                        setHour({ ...hour, startDate: String(value) });
                      }}
                      initialFocus
                      // disabled={
                      //   appDetails['Start date'] && appDetails['End date']
                      //     ? {
                      //         before: new Date(appDetails['Start date']),
                      //         after: new Date(appDetails['End date']),
                      //       }
                      //     : undefined
                      // }
                    />
                  </PopoverContent>
                </Popover>
                <TimePicker
                  onSelectTime={(time: string) => {
                    setHour({ ...hour, startTime: time });
                  }}
                  timeToDisplay={hour.startTime}
                  hint={'Time'}
                  triggerClassName=''
                />
              </div>
              <div
                className={
                  'flex flex-row w-full items-center justify-start gap-6'
                }
              >
                <Label>Closes</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={'outline'}
                      className={cn(
                        'w-[160px] justify-start text-left font-normal',
                        !hour['endDate'] && 'text-muted-foreground'
                      )}
                    >
                      <CalendarIcon className={'mr-2'} />
                      {hour['endDate'] ? (
                        dayjs(hour['endDate']).format('ddd, MMM D')
                      ) : (
                        <span>Select a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className='w-auto p-0' align='start'>
                    <Calendar
                      mode='single'
                      selected={
                        hour['endDate'] ? new Date(hour['endDate']) : undefined
                      }
                      onSelect={(value) => {
                        setHour({ ...hour, endDate: String(value) });
                      }}
                      initialFocus
                      // disabled={
                      //   appDetails['Start date'] && appDetails['End date']
                      //     ? {
                      //         before: new Date(appDetails['Start date']),
                      //         after: new Date(appDetails['End date']),
                      //       }
                      //     : undefined
                      // }
                    />
                  </PopoverContent>
                </Popover>
                <TimePicker
                  onSelectTime={(time: string) => {
                    setHour({ ...hour, endTime: time });
                  }}
                  timeToDisplay={hour.endTime}
                  hint='Time'
                  triggerClassName=''
                />
              </div>
            </div>
            <Button
              variant={'default'}
              className={
                'font-light h-10 w-36 gap-1 mx-auto bg-emerald-500 text-neutral-50'
              }
              onClick={handleAddPinHour}
            >
              <AlarmClockPlus /> Add hours
            </Button>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Opens at</TableHead>
                <TableHead className={'text-center'}>Closes at</TableHead>
                <TableHead className={'text-end'}>Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {hours.length > 0 ? (
                hours.map((pinHour: HourInputs, index: number) => {
                  return (
                    <TableRow key={`pin-hour-table-row-${index}`}>
                      <TableCell>
                        {dayjs(pinHour.startDate).format('ddd, MMM D')}
                        {` @ `}
                        {dayjs(pinHour.startTime, 'HH:mm:ss').format('h:mm a')}
                      </TableCell>
                      <TableCell className={'text-center'}>
                        {dayjs(pinHour.endDate).format('ddd, MMM D')}
                        {` @ `}
                        {dayjs(pinHour.endTime, 'HH:mm:ss').format('h:mm a')}
                      </TableCell>
                      <TableCell className={'text-end'}>
                        <Button
                          variant={'destructive'}
                          onClick={() => {
                            const pinHoursCopy = [...hours];
                            pinHoursCopy.splice(index, 1);
                            setHours(pinHoursCopy);
                          }}
                        >
                          X
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow
                  className={
                    'p-2 border w-full mx-6 text-center text-sm font-mono'
                  }
                >
                  <TableCell className={'text-start'}>-</TableCell>
                  <TableCell className={'text-center'}>-</TableCell>
                  <TableCell className={'text-end'}>-</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default HoursPicker;
