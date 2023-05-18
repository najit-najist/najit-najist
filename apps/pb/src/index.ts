export * from 'pocketbase';
export { default as PocketBase } from 'pocketbase';
import PocketBase from 'pocketbase';

export const pocketbase = new PocketBase(String(process.env.POCKETBASE_ORIGIN));

pocketbase.autoCancellation(false);
