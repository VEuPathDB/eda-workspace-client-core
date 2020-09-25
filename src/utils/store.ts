export type StoreMethod = 'get' | 'put' | 'post' | 'delete';
export type StoreMethodFunction<T, S extends StoreMethod, I> =
  S extends 'get' ? (id: I) => Promise<T> :
  S extends 'put' ? (id: I, body: T) => Promise<void> :
  S extends 'post' ? (body: T) => Promise<I> :
  S extends 'delete' ? (id: I) => Promise<void> :
  never; 
export type Store<T, S extends StoreMethod = StoreMethod, I = string> = {
  [Key in S]: StoreMethodFunction<T, Key, I>
}
