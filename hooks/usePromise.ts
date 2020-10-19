import { useEffect, useState } from "react";

export type PromiseHookState<T> = {
  value?: T;
  pending: boolean;
  error?: unknown;
}

export function usePromise<T>(promiseFactory: () => Promise<T>): PromiseHookState<T> {
  const [state, setState] = useState<PromiseHookState<T>>({
    pending: true,
  })
  const [ignoreResolve, setIgnoreResolve] = useState(false);
  useEffect(() => {
    promiseFactory().then(
      value => {
        if (ignoreResolve) return;
        setState({
          value,
          pending: false,
        });
      },
      error => {
        if (ignoreResolve) return;
        setState({
          error,
          pending: false
        });
      })
    return function cancel() {
      setIgnoreResolve(true);
    }
  }, [ignoreResolve, promiseFactory]);
  return state;
}
