import { splitBase64Url } from '@najit-najist/schemas';
import { EntityLink } from '@najit-najist/schemas';
import { PgTableWithColumns } from 'drizzle-orm/pg-core';
import fs from 'fs-extra';
import crypto from 'node:crypto';
import path from 'path';

import { logger } from './server';

type CreateAction = {
  action: 'CREATE';
  content: string;
  filepath: string;
};

type DeleteAction = {
  action: 'DEL';
  filepath: string;
};

export class LibraryService<M extends PgTableWithColumns<any>> {
  private transactionActive = false;
  private model: M;
  private actions: (CreateAction | DeleteAction)[] = [];

  constructor(model: M) {
    this.model = model;
  }

  private async commitFile(absoluteFilepath: string, base64Content: string) {
    try {
      const fileAsBlob = await fetch(base64Content).then((res) => res.blob());
      await fs.writeFile(absoluteFilepath, fileAsBlob);
    } catch (error) {
      logger.error(
        { error, absoluteFilepath },
        'Failed to commit file to file system'
      );

      return error as Error;
    }
  }

  private async commitDelete(absoluteFilepath: string) {
    try {
      await fs.remove(absoluteFilepath);
    } catch (error) {
      logger.error(
        { error, absoluteFilepath },
        'Failed to delete file from file system'
      );

      return error as Error;
    }
  }

  private createOwnerRoot(owner: EntityLink) {
    const webRoot = require.resolve('@najit-najist/web');
    return path.join(
      webRoot,
      'private',
      'uploads',
      this.model._.name,
      String(owner.id)
    );
  }

  private createAbsoluteFilepath(owner: EntityLink, filename: string) {
    const ownerRoot = this.createOwnerRoot(owner);
    const randomPrefix = crypto.randomBytes(8).toString('hex');
    return path.join(ownerRoot, `${randomPrefix}--${filename}`);
  }

  async create(owner: EntityLink, encodedFilename: string) {
    const { filename, base64 } = splitBase64Url(encodedFilename);

    if (!filename) {
      throw new Error('Base64 file must have filename in its contents');
    }

    const absoluteFilepath = this.createAbsoluteFilepath(owner, filename);
    if (this.transactionActive) {
      this.actions.push({
        action: 'CREATE',
        content: base64,
        filepath: absoluteFilepath,
      });
    } else {
      await this.commitFile(absoluteFilepath, base64);
    }

    return { filepath: absoluteFilepath };
  }

  async delete(owner: EntityLink, filename: string) {
    const ownerRoot = this.createOwnerRoot(owner);
    const absoluteFilepath = path.join(ownerRoot, filename);

    if (this.transactionActive) {
      this.actions.push({
        action: 'DEL',
        filepath: absoluteFilepath,
      });
      return;
    }

    await this.commitDelete(absoluteFilepath);
  }

  beginTransaction() {
    this.transactionActive = true;
  }

  endTransaction() {
    this.actions = [];
    this.transactionActive = false;
  }

  async commit() {
    // TODO
    this.endTransaction();
  }
}
