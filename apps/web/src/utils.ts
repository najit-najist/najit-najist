import Compressor from 'compressorjs';
import {
  getMediaTypeFromBase64Url,
  setFileNameToBase64,
} from '@najit-najist/api';

export enum ReadFileError {
  UNKNOWN = 'unknown',
  NOT_VALID = 'not-valid',
}

export const readFile = async (
  file: File,
  { filter, width }: { filter: RegExp; width?: number }
) => {
  const compressedFile = await new Promise<File>((resolve, reject) => {
    new Compressor(file, {
      quality: 0.8,
      width,
      success: (result) => resolve(result as File),
      error: reject,
    });
  });

  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onabort = () => console.log('file reading was aborted');
    reader.onerror = () =>
      reject(new Error('Stala se neočekávaná chyba při nahrávání'));

    reader.onload = () => {
      if (!reader.result) {
        return;
      }

      const result = String(reader.result);
      const mimeType = getMediaTypeFromBase64Url(result);

      if (filter.test(mimeType)) {
        resolve(setFileNameToBase64(result, file.name));
      } else {
        reject(new Error(`Soubor '${file.name}' není správný formát`));
      }
    };

    reader.readAsDataURL(compressedFile);
  });
};