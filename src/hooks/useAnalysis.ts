import { TypeOf } from "io-ts";
import { useCallback, useEffect, useState } from "react";
import { Analysis } from "../types/analysis";
import { Store } from "../utils/store";
import { usePromise } from "./usePromise";

export type Analysis = TypeOf<typeof Analysis>;
export type AnalysisStore = Store<Analysis>;

export function useAnalysis(store: AnalysisStore, analysisId: string) {
  const [analysis, setAnalysis] = useState<Analysis>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const savedAnalysis = usePromise(useCallback(() => store.get(analysisId), [store, analysisId]));

  useEffect(() => {
    setAnalysis(savedAnalysis.value);
  }, [savedAnalysis]);

  const useSetter = <T extends keyof Analysis>(properyName: T) => useCallback((value: Analysis[T]) => {
    setAnalysis(_a => _a && ({ ..._a, [properyName]: value }));
    setHasUnsavedChanges(true);
  }, [properyName]);

  const copyAnalysis = useCallback(async () => {
    if (savedAnalysis.value == null) throw new Error("Attempt to copy an analysis that hasn't been loaded.");
    const id = await store.post(savedAnalysis.value);
    return id
  }, [store, savedAnalysis]);

  const deleteAnalysis = useCallback(async () => {
    return store.delete(analysisId);
  }, [ store, analysisId ]);

  const saveAnalysis = useCallback(async () => {
    if (analysis == null) throw new Error("Attempt to save an analysis that hasn't been loaded.");
    await store.put(analysisId, analysis)
    setHasUnsavedChanges(false);
  }, [ store, analysisId, analysis ])

  return {
    status: savedAnalysis.pending ? 'in-progress'
          : savedAnalysis.error ? 'error'
          : 'loaded',
    hasUnsavedChanges,
    analysis: analysis,
    setName: useSetter('name'),
    setFilters: useSetter('filters'),
    setVisualizations: useSetter('visualizations'),
    setDerivedVariables: useSetter('derivedVariables'),
    setStarredVariables: useSetter('starredVariables'),
    setVariableUISettings: useSetter('variableUISettings'),
    copyAnalysis,
    deleteAnalysis,
    saveAnalysis
  }
}
