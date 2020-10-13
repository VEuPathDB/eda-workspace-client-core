import { useCallback } from "react";
import { Study } from "../types/study";
import { Store } from "../utils/store";
import { PromiseHookState, usePromise } from "./usePromise";

export type StudyStore = Store<Study, 'get'>;

export function useStudy(store: StudyStore, studyId: string): PromiseHookState<Study> {
  return usePromise(useCallback(() => store.get(studyId), [ store, studyId]));
}
