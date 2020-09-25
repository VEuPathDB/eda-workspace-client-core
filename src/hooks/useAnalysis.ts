import { TypeOf } from "io-ts";
import { useCallback, useEffect, useState } from "react";
import { Analysis } from "../types/analysis";
import { Store } from "../utils/store";
import { usePromise } from "./usePromise";

export type Analysis = TypeOf<typeof Analysis>;
export type AnalysisStore = Store<Analysis>;

type Setter<T extends keyof Analysis> = (value: Analysis[T]) => void;

type Return = {
  status: 'in-progress' | 'error' | 'loaded';
  hasUnsavedChanges: boolean;
  analysis: Analysis | undefined;
  setName: Setter<'name'>;
  setFilters: Setter<'filters'>;
  setVisualizations: Setter<'visualizations'>;
  setDerivedVariables: Setter<'derivedVariables'>;
  setStarredVariables: Setter<'starredVariables'>;
  setVariableUISettings: Setter<'variableUISettings'>;
  copyAnalysis: () => Promise<string>;
  deleteAnalysis: () => Promise<void>;
  saveAnalysis: () => Promise<void>;
}

export function useAnalysis(store: AnalysisStore, analysisId: string): Return {
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

  const saveAnalysis = useCallback(async () => {
    if (analysis == null) throw new Error("Attempt to save an analysis that hasn't been loaded.");
    await store.put(analysisId, analysis)
    setHasUnsavedChanges(false);
  }, [store, analysisId, analysis])

  const copyAnalysis = useCallback(async () => {
    if (analysis == null) throw new Error("Attempt to copy an analysis that hasn't been loaded.");
    if (hasUnsavedChanges) await saveAnalysis();
    const id = await store.post(analysis);
    return id
  }, [store, analysis, saveAnalysis, hasUnsavedChanges]);

  const deleteAnalysis = useCallback(async () => {
    return store.delete(analysisId);
  }, [store, analysisId]);

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
