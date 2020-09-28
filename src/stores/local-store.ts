import { Type } from 'io-ts';
import localforage from 'localforage';
import { v4 as uuid } from 'uuid';
import { decode } from '../utils/decoder-utils';
import { Store } from "../utils/store";

export function makeLocalStore<T>(name: string, decoder: Type<T>): Store<T> {
  const store = localforage.createInstance({
    name
  });
  async function get(id: string): Promise<T> {
    return decode(decoder, await store.getItem(id));
  }
  async function post(body: T): Promise<string> {
    const id = uuid();
    await store.setItem(id, body);
    return id;
  }
  async function put(id: string, body: T): Promise<void> {
    await store.setItem(id, body);
  }
  async function del(id: string): Promise<void> {
    await store.removeItem(id);
  }
  return { get, post, put, delete: del };
}