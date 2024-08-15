'use client';

import { DEFAULT_DATE_FORMAT } from '@constants';
import { dayjs } from '@dayjs';
import { useEffect, useState } from 'react';

export function EditedAt({
  updatedAt,
  createdAt,
}: {
  updatedAt?: Date | null;
  createdAt: Date | null;
}) {
  const [updatedAtAsText, setUpdatedAtAsText] = useState(
    updatedAt ? dayjs(updatedAt).fromNow() : undefined,
  );

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;

    if (updatedAt) {
      const updateText = () => setUpdatedAtAsText(dayjs(updatedAt).fromNow());

      updateText();
      timer = setTimeout(updateText, 30 * 1000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [updatedAt]);

  return (
    <div className="ml-5 text-gray-500 tet-sm flex flex-col">
      {updatedAtAsText ? (
        <>Upraveno: {updatedAtAsText}</>
      ) : (
        <>Vytvořeno: {dayjs(createdAt).format(DEFAULT_DATE_FORMAT)}</>
      )}
    </div>
  );
}
