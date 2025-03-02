'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/solid';
import { cx } from 'class-variance-authority';
import * as React from 'react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';
import { cs } from 'react-day-picker/locale';

import { Button } from './Button';
import { buttonStyles } from './Button/buttonStyles';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;
export { type SelectSingleEventHandler };

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cx(className)}
      locale={cs}
      classNames={{
        months: 'flex flex-col space-y-4 sm:space-x-4 sm:space-y-0 relative',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-semibold text-gray-500',
        nav: 'space-x-1 flex items-center absolute right-0 mr-0',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: 'h-11 sm:h-9 w-11 sm:w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20',
        day: cx(
          'h-11 sm:h-9 w-11 sm:w-9 p-0 font-normal aria-selected:opacity-100 rounded-project-input duration-200',
        ),
        range_end: 'day-range-end',
        selected:
          'bg-project-primary text-white hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        today: 'bg-accent text-accent-foreground',
        outside:
          'day-outside text-gray-300 aria-selected:bg-accent/50 aria-selected:text-muted-foreground',
        disabled: 'text-gray-200 bg-gray-100 opacity-50',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        hidden: 'invisible',
        weekday: 'h-11 sm:h-9 w-11 sm:w-9 text-center',
        day_button: 'm-auto w-full h-full cursor-pointer',
        ...classNames,
      }}
      components={{
        PreviousMonthButton: (props) => (
          <Button
            {...props}
            color="primary"
            appearance="unstyled"
            size="xsm"
            className={cx(
              props.className,
              'w-7 h-7 leading-8 rounded border-2 border-project-primary active:scale-95 disabled:border-gray-200 disabled:bg-gray-100 opacity-80 flex items-center justify-center bg-project-primary text-white disabled:text-gray-400',
              'rounded-xl',
            )}
          >
            <ChevronLeftIcon className="w-5 h-5" />
          </Button>
        ),
        NextMonthButton: (props) => (
          <Button
            {...props}
            color="primary"
            appearance="unstyled"
            size="xsm"
            className={cx(
              props.className,
              'w-7 h-7 leading-8 rounded border-2 border-project-primary active:scale-95 disabled:border-gray-200 disabled:bg-gray-100 opacity-80 flex items-center justify-center bg-project-primary text-white disabled:text-gray-400',
              'rounded-xl',
            )}
          >
            <ChevronRightIcon className="w-5 h-5" />
          </Button>
        ),
        // IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        // IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
