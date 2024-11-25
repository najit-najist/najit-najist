import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Calendar } from '@components/common/Calendar';
import { Paper } from '@components/common/Paper';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { ItemBase, Select } from '@components/common/form/Select';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { DEFAULT_TIMEZONE, Dayjs, dayjs } from '@dayjs';
import { Popover } from '@headlessui/react';
import {
  CalendarIcon,
  ClockIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { getMinimumPickupTimeForDate } from '@najit-najist/schemas';
import 'dayjs/plugin/timezone';
import { FC, useMemo, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { useController, useFormState } from 'react-hook-form';

import { FormValues } from './types';

type TimeOption = ItemBase & {
  label: string;
  disabled?: boolean;
};

const HOUR_SLICED_TIMES = 4;
const STARTING_HOURS = 10;
const ENDING_HOURS = 18;
const TIME_PART_FROM_HOUR = 60 / HOUR_SLICED_TIMES;

const timeOptions = new Map(
  new Array((ENDING_HOURS - STARTING_HOURS) * HOUR_SLICED_TIMES + 1)
    .fill(null)
    .map((_, index): [string, TimeOption] => {
      const item = dayjs()
        .set('hour', STARTING_HOURS)
        .set('minute', index * TIME_PART_FROM_HOUR)
        .format('HH:mm');

      return [
        item,
        {
          id: item,
          label: item,
        },
      ];
    }),
);

const timeOptionsAsArray = [...timeOptions.values()];

const fieldDateFormat = 'YYYY-MM-DDTHH:mm:00';
const dayjsToFieldValue = (datetime: Dayjs) => datetime.format(fieldDateFormat);
const fieldValueToDayjs = (datetime: string) =>
  dayjs(datetime, fieldDateFormat).tz(DEFAULT_TIMEZONE, true);

export const LocalPickupDeliveryTimePicker: FC = () => {
  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const { field, fieldState } = useController<
    Pick<FormValues, 'deliveryMethod'>
  >({
    name: 'deliveryMethod.meta',
  });

  const [now, setNow] = useState(dayjs());

  const selectOptionForDate = useMemo((): TimeOption[] => {
    if (
      !field.value ||
      (typeof field.value === 'object' && field.value !== null)
    ) {
      return [];
    }

    const minimumForDate = getMinimumPickupTimeForDate(
      fieldValueToDayjs(field.value),
    );

    if (!minimumForDate) {
      return [];
    }

    const minimumForDateAsDayjs = dayjs(minimumForDate);
    const minimumFormatted = minimumForDateAsDayjs.format('HH:mm');
    const skip = timeOptionsAsArray.findIndex(
      ({ id }) => id === minimumFormatted,
    );

    return timeOptionsAsArray.slice(skip);
  }, [field.value]);

  const minimumPickupTimeForNow = useMemo(
    () => getMinimumPickupTimeForDate(now),
    [now],
  );
  const minimumDate = useMemo(
    () =>
      dayjs()
        .add(minimumPickupTimeForNow ? 0 : 1, 'day')
        .toDate(),
    [minimumPickupTimeForNow],
  );

  const onChange: SelectSingleEventHandler = (newDate) => {
    if (!newDate) {
      return field.onChange(null);
    }

    const incommingDateAsValue = [
      [newDate.getFullYear(), newDate.getMonth() + 1, newDate.getDate()]
        .map((val) => val.toString().padStart(2, '0'))
        .join('-'),
      [newDate.getHours(), newDate.getMinutes(), 0]
        .map((val) => val.toString().padStart(2, '0'))
        .join(':'),
    ].join('T');

    const nextValue = getMinimumPickupTimeForDate(
      fieldValueToDayjs(incommingDateAsValue),
    );

    if (!nextValue) {
      setNow(dayjs());
    }

    field.onChange(
      nextValue
        ? dayjsToFieldValue(nextValue.add(nextValue ? 0 : 1, 'day'))
        : null,
    );
  };

  const onTimeChange = (value: TimeOption | null) => {
    if (!value) {
      return;
    }
    const [hour, minute] = value.id.toString().split(':').map(Number);

    field.onChange(
      dayjsToFieldValue(
        dayjs(String(field.value)).set('hour', hour).set('minute', minute),
      ),
    );
  };

  const [selectedDateAsDate, selectedTime] = useMemo((): [
    Date | undefined,
    TimeOption | null,
  ] => {
    if (
      !field.value ||
      (typeof field.value === 'object' && field.value !== null)
    ) {
      return [undefined, null];
    }
    const valueAsDayjs = fieldValueToDayjs(String(field.value));

    if (!valueAsDayjs.isValid()) {
      return [undefined, null];
    }

    return [
      valueAsDayjs.startOf('day').toDate(),
      timeOptions.get(valueAsDayjs.format('HH:mm')) ?? null,
    ];
  }, [field.value]);

  return (
    <>
      <hr className="mt-8 mb-5 border-t border-gray-200" />

      <Alert
        className="w-full"
        heading="Vyberte datum a čas vyzvednutí"
        color="warning"
        icon={ClockIcon}
      >
        <div>
          <p className="mb-4">
            Vyberte si datum a čas vyzvednutí na prodejně, který Vám vyhovuje
            nejvíce!
          </p>
        </div>
        <div>
          <Popover className="relative text-black max-w-sm">
            <Popover.Button
              as={'button'}
              disabled={formState.isSubmitting || isActive}
              className="flex justify-between items-center bg-white disabled:opacity-50 disabled:cursor-not-allowed w-full border-gray-300 focus:outline-none border py-[0.55rem] px-3 sm:text-sm placeholder-gray-300 rounded-l-md rounded-r-md shadow-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-400 focus:border-green-400 "
            >
              {field.value ? (
                <>
                  {fieldValueToDayjs(String(field.value)).format(
                    DEFAULT_DATE_FORMAT,
                  )}
                  <PencilIcon className="ml-4 -mt-0.5 inline w-5 h-5" />
                </>
              ) : (
                <>
                  Vyberte čas a datum vyzvednutí{' '}
                  <CalendarIcon className="ml-4 -mt-0.5 inline w-4 h-4" />
                </>
              )}
            </Popover.Button>
            <Popover.Panel className="absolute left-1/2 z-10 mt-3 -translate-x-1/2 transform sm:px-0">
              {({ close }) => (
                <Paper className="p-2">
                  <Button
                    onClick={() => close()}
                    appearance="extraSmall"
                    className="ml-auto block"
                  >
                    Hotovo
                  </Button>
                  <hr className="my-3 border-t border-gray-200 mt-3" />
                  <Calendar
                    mode="single"
                    ISOWeek
                    fromDate={minimumDate}
                    disabled={formState.isSubmitting || isActive}
                    onSelect={onChange}
                    selected={selectedDateAsDate}
                    toMonth={now.add(2, 'month').toDate()}
                    toYear={now.get('year')}
                  />
                  <hr className="my-3 border-t border-gray-200" />
                  <Select
                    selected={selectedTime}
                    items={selectOptionForDate}
                    disabled={
                      formState.isSubmitting || isActive || !field.value
                    }
                    fallbackButtonContents={
                      field.value
                        ? 'Vyberte čas vyzvednutí'
                        : 'Nejprve vyberte datum'
                    }
                    formatter={(item) => <>{item.label}</>}
                    onChange={onTimeChange}
                  />
                </Paper>
              )}
            </Popover.Panel>
          </Popover>
          {fieldState.error ? (
            <ErrorMessage className="mt-2 block">
              {fieldState.error.message}
            </ErrorMessage>
          ) : null}
        </div>
      </Alert>
    </>
  );
};
