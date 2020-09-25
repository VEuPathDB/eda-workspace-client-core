import { TypeOf } from "io-ts";
import { useCallback } from "react";
import { Study } from "../types/study";
import { Store } from "../utils/store";
import { PromiseHookReturn, usePromise } from "./usePromise";

export type Study = TypeOf<typeof Study>;
export type StudyStore = Store<Study, 'get'>;

export function useStudy(store: StudyStore, studyId: string): PromiseHookReturn<Study> {
  return usePromise(useCallback(() => store.get(studyId), [ store, studyId]));
}
