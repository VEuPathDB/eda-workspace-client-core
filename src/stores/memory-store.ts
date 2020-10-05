import { v4 as uuid } from 'uuid';
import { Store } from '../utils/store';

export function makeMemoryStore<T>(): Store<T> {
  const records: Record<string, T> = {};
  async function get(id: string): Promise<T> {
    if (id in records) return records[id];
    throw new Error(`Not found: memory store does not have a record for ${id}.`);
  }
  async function post(value: T): Promise<string> {
    const id = uuid();
    records[id] = value;
    return id;
  }
  async function put(id: string, value: T): Promise<void> {
    records[id] = value;
  }
  async function del(id: string): Promise<void> {
    delete records[id];
  }
  return { get, post, put, delete: del };
}
