import { Store } from "../utils/store";

// TODO add optional decoders to transform REST response to expected output.

/**
 * REST-based implementation of `Store`
 */
export function makeRestStore<T>(resourceUrl: string): Store<T> {
  async function get(id: string) {
    const response = await fetch(resourceUrl + '/' + id);
    return response.json();
  }
  async function put(id: string, body: T) {
    const response = await fetch(resourceUrl + '/' + id, {
      method: 'put',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });
    return response.json();
  }
  async function post(body: T) {
    const response = await fetch(resourceUrl, {
      method: 'post',
      body: JSON.stringify(body),
      headers: { 'Content-Type': 'application/json' }
    });
    const json = await response.json();
    return json.id;
  }
  async function del(id: string) {
    await fetch(resourceUrl + '/' + id, {
      method: 'delete'
    });
  }
  return { get, put, post, delete: del };
}
