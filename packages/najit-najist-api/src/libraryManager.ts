import { encodedImageSchema, splitBase64Url } from '@najit-najist/schemas';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import fs from 'fs-extra';
import crypto from 'node:crypto';
import path from 'path';

import { logger } from './server';

// TODO: handle delete
export const libraryManager = {
  getEntityRoot: <M extends PgTableWithColumns<any>>(
    model: M,
    ownerId: number
  ) => {
    const webRoot = require.resolve('@najit-najist/web');
    return path.join(
      webRoot,
      'private',
      'uploads',
      model._.name,
      String(ownerId)
    );
  },

  async saveFile<M extends PgTableWithColumns<any>>(
    model: M,
    ownerId: number,
    encodedFile: string
  ) {
    const { filename } = splitBase64Url(encodedFile);

    if (!filename) {
      throw new Error('base64 file url should have pathname included');
    }

    const fileAsBlob = await fetch(encodedFile).then((res) => res.blob());
    const ownerRoot = this.getEntityRoot(model, ownerId);
    const randomPrefix = crypto.randomBytes(8).toString('hex');
    const newFilename = `${randomPrefix}--${filename}`;

    await fs.writeFile(path.join(ownerRoot, newFilename), fileAsBlob);

    return {
      blob: fileAsBlob,
      filename: newFilename,
      absoluteFilename: path.join(ownerRoot, newFilename),
    };
  },

  async handleUploadedForModel<M extends PgTableWithColumns<any>>(
    model: M,
    ownerId: number,
    fileNameOrEncodedImage: string
  ) {
    if (!encodedImageSchema.safeParse(fileNameOrEncodedImage).success) {
      // If its just a filename then there is no need to upload it
      return;
    }

    return this.saveFile(model, ownerId, fileNameOrEncodedImage);
  },

  async deleteEntityRoot<M extends PgTableWithColumns<any>>(
    model: M,
    ownerId: number
  ) {
    await fs.remove(this.getEntityRoot(model, ownerId));
  },

  async deleteFilesFromStorage<M extends PgTableWithColumns<any>>(
    model: M,
    ownerId: number,
    fileNames: string[]
  ) {
    const ownerRoot = this.getEntityRoot(model, ownerId);

    let deletingFiles: Promise<any>[] = [];
    for (const filename of fileNames) {
      deletingFiles.push(
        fs
          .remove(path.join(ownerRoot, filename))
          .catch((error) =>
            logger.error(
              error,
              `Failed to remove file ${filename} for ${model._.name} of ${ownerId}`
            )
          )
      );
    }

    await Promise.all(deletingFiles);
  },
};
