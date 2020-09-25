import { Type } from "io-ts";
import { useEffect, useState } from "react";
import { fetchWithCodec } from "../utils/fetch";

type Return<T> = {
  value: T | undefined;
  error: unknown;
  isLoading: boolean;
}

/**
 * Call `fetch` and apply `codec` to the result. When `codec` or `input`
 * changes, the request is aborted.
 * 
 * @param codec An `io-ts` `Type` object
 * @param input See `fetch`
 */
export function useFetchWithCodec<A>(codec: Type<A>, input: RequestInfo): Return<A> {
  const [value, setValue] = useState<A>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<unknown>();  
  useEffect(() => {
    const abortController = new AbortController();
    const { signal } = abortController;
    (async () => {
      try {
        setValue(await fetchWithCodec(codec, input, { signal }));
      }
      catch (error: unknown) {
        setError(error);
      }
      finally {
        setIsLoading(false);
      }
    })();
    return function cancel() {
      abortController.abort();
    }
  }, [codec, input])
  return { value, isLoading, error };
}
