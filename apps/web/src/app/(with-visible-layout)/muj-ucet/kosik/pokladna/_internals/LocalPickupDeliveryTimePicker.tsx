import { Alert } from '@components/common/Alert';
import { Button } from '@components/common/Button';
import { Calendar } from '@components/common/Calendar';
import { Modal } from '@components/common/Modal';
import { Paper } from '@components/common/Paper';
import { ErrorMessage } from '@components/common/form/ErrorMessage';
import { ItemBase, Select } from '@components/common/form/Select';
import { DEFAULT_DATE_FORMAT } from '@constants';
import { useReactTransitionContext } from '@contexts/reactTransitionContext';
import { DEFAULT_TIMEZONE, Dayjs, dayjs } from '@dayjs';
import {
  Label,
  Popover,
  PopoverButton,
  PopoverPanel,
  Radio,
  RadioGroup,
} from '@headlessui/react';
import {
  CalendarIcon,
  ClockIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import { getMinimumPickupTimeForDate } from '@najit-najist/schemas';
import { cx } from 'class-variance-authority';
import 'dayjs/plugin/timezone';
import { FC, useMemo, useState } from 'react';
import { SelectSingleEventHandler } from 'react-day-picker';
import { useController, useFormState } from 'react-hook-form';

import { FormValues } from './types';

type TimeOption = ItemBase & {
  label: string;
  disabled?: boolean;
};

const HOUR_SLICED_TIMES = 2;
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [now, setNow] = useState(dayjs());

  const { isActive } = useReactTransitionContext();
  const formState = useFormState();
  const { field, fieldState } = useController<
    Pick<FormValues, 'deliveryMethod'>
  >({
    name: 'deliveryMethod.meta',
  });

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

    setIsModalOpen(false);
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

  const handleOpenPicker = () => {
    setIsModalOpen((current) => {
      if (!current && !field.value) {
        // @ts-ignore
        onChange(minimumDate);
      }

      return !current;
    });
  };

  return (
    <>
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
          <button
            type="button"
            ref={field.ref}
            disabled={formState.isSubmitting || isActive}
            className="flex justify-between items-center bg-white disabled:opacity-50 disabled:cursor-not-allowed w-full border-gray-300 focus:outline-none border py-[0.55rem] px-3 sm:text-sm placeholder-gray-300 rounded-l-project-input rounded-r-project-input shadow-sm focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-green-400 focus:border-green-400 "
            onClick={handleOpenPicker}
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
          </button>

          <Modal
            width="lg"
            title="Vyberte datum a čas vyzvednutí"
            open={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            closeButtonText="potvrdit"
          >
            <div className="sm:flex items-start gap-5 mt-5">
              <Calendar
                ISOWeek
                className="flex-none"
                mode="single"
                hidden={{
                  before: minimumDate,
                }}
                disabled={formState.isSubmitting || isActive}
                onSelect={onChange}
                selected={selectedDateAsDate}
                startMonth={now.toDate()}
                endMonth={now.add(2, 'month').toDate()}
              />

              <hr className="block border-t border-gray-200 mt-4 mb-4 sm:hidden" />

              <RadioGroup
                value={selectedTime}
                onChange={onTimeChange}
                className="grid grid-cols-2 gap-2 w-full"
              >
                {selectOptionForDate.map((item) => (
                  <Radio
                    key={item.id}
                    disabled={item.disabled}
                    value={item}
                    className={({ checked, disabled }) =>
                      cx(
                        'flex w-full border rounded-project-input px-2 py-1 items-center',
                        checked ? 'border-project-primary' : 'border-gray-200',
                        disabled ? 'cursor-not-allowed' : 'cursor-pointer',
                      )
                    }
                  >
                    {({ disabled, checked, focus }) => (
                      <>
                        <div
                          className={cx(
                            'duration-200 flex-none mr-2 relative flex h-4.5 w-4.5 rounded-full border-2',
                            disabled ? 'bg-gray-100' : 'bg-white',
                            checked
                              ? 'border-project-primary'
                              : 'border-project',
                          )}
                        >
                          <div
                            className={cx(
                              'h-2 w-2 rounded-full top-1 left-1 bg-project-primary m-auto duration-200',
                              checked ? 'opacity-100' : 'opacity-0',
                              focus ? '!bg-project-primary/50 opacity-100' : '',
                            )}
                          />
                        </div>
                        <Label
                          as="p"
                          className={cx('font-medium text-gray-900 text-lg')}
                        >
                          {item.label}
                        </Label>
                      </>
                    )}
                  </Radio>
                ))}
                {selectOptionForDate.length === 0 ? (
                  <div className="bg-gray-100 border border-gray-300 text-gray-500 rounded-project-input px-3 py-2 text-sm col-span-2">
                    Již nemámé žádné dustupné časy pro tento datum
                  </div>
                ) : null}
              </RadioGroup>
            </div>
          </Modal>

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
