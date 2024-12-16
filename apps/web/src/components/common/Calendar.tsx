'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { cx } from 'class-variance-authority';
import { cs } from 'date-fns/locale';
import * as React from 'react';
import { DayPicker, SelectSingleEventHandler } from 'react-day-picker';

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
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        month: 'space-y-4',
        caption: 'flex justify-center pt-1 relative items-center',
        caption_label: 'text-sm font-medium capitalize',
        nav: 'space-x-1 flex items-center',
        nav_button: cx(
          buttonStyles({}),
          'h-7 w-7 !p-0 flex justify-center items-center',
        ),
        nav_button_previous: 'absolute left-1',
        nav_button_next: 'absolute right-1',
        table: 'w-full border-collapse space-y-1',
        head_row: 'flex',
        head_cell:
          'text-muted-foreground rounded-project w-9 font-normal text-[0.8rem]',
        row: 'flex w-full mt-2',
        cell: cx(
          'h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-project-input [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-project-primary first:[&:has([aria-selected])]:rounded-l-project-input last:[&:has([aria-selected])]:rounded-r-project-input focus-within:relative focus-within:z-20',

          // '[&:has(>_[disabled])]:bg-gray-100',
        ),
        day: cx(
          buttonStyles({ appearance: 'link' }),
          'h-9 w-9 p-0 font-normal aria-selected:opacity-100 flex justify-center items-center px-1 disabled:cursor-disabled cursor-pointer',
        ),
        day_range_end: 'day-range-end',
        day_selected:
          '!bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        day_outside:
          'day-outside text-gray-600 opacity-50 hover:no-underline aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30',
        day_disabled:
          'day-disabled opacity-50 bg-red-200 !text-red-500 rounded-project-input',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_hidden: 'invisible',
        ...classNames,
      }}
      components={{
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
