import { isFileBase64 } from '@utils/isFileBase64';
import { splitBase64Url } from '@utils/splitBase64Url';

import { dayjs } from '../../dayjs';

type Primitives =
  | string
  | number
  | boolean
  | undefined
  | Date
  | null
  | Record<string, string>;

export const objectToFormData = async (
  input: Record<string, Primitives | Primitives[]>
) => {
  const result = new FormData();

  for (const [key, value] of Object.entries(input)) {
    const append = async (primitive: Primitives) => {
      if (primitive === undefined) {
        return;
      }

      let stringValue =
        typeof primitive === 'object'
          ? JSON.stringify(primitive)
          : String(primitive);

      if (primitive instanceof Date) {
        stringValue = dayjs(primitive).utc().format();
      }

      if (isFileBase64(stringValue)) {
        const { mediaType, filename } = splitBase64Url(stringValue);

        if (!filename) {
          throw new Error('base64 file url should have pathname included');
        }

        result.append(
          key,
          await fetch(stringValue).then((res) => res.blob()),
          filename
        );
      } else {
        result.append(key, stringValue);
      }
    };

    if (Array.isArray(value)) {
      for (const piece of value) {
        await append(piece);
      }
    } else {
      await append(value);
    }
  }

  return result;
};
