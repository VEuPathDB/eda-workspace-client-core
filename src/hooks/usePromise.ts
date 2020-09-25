import { useEffect, useState } from "react";

export type PromiseHookReturn<T> = {
  value: T | undefined;
  pending: boolean;
  error: unknown;
}

export function usePromise<T>(promiseFactory: () => Promise<T>): PromiseHookReturn<T> {
  const [value, setValue] = useState<T>();
  const [error, setError] = useState<unknown>();
  const [pending, setPending] = useState(true);
  const [ignoreResolve, setIgnoreResolve] = useState(false);
  useEffect(() => {
    promiseFactory().then(
      _value => {
        if (ignoreResolve) return;
        setValue(_value);
        setPending(false);
      },
      _error => {
        if (ignoreResolve) return;
        setError(_error);
        setPending(false);
      })
    return function cancel() {
      setIgnoreResolve(true);
    }
  }, [ignoreResolve, promiseFactory]);
  return { value, error, pending };
}
