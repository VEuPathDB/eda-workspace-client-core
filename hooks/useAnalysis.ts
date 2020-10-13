import localforage from 'localforage';
import { useCallback, useEffect, useState } from "react";
import { Analysis } from "../types/analysis";
import { usePromise } from "./usePromise";

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

export function useAnalysis(analysisId: string): Return {
  const [analysis, setAnalysis] = useState<Analysis>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const store = localforage.createInstance({
    name: 'eda-workspace-analysis-store'
  });
  const savedAnalysis = usePromise(useCallback(async (): Promise<Analysis> => {
    const item = await store.getItem<Analysis|null>(analysisId);
    if (item != null) return item;
    return {
      name: 'Unsaved Analysis',
      filters: [],
      derivedVariables: [],
      starredVariables: [],
      visualizations: [],
      variableUISettings: {},
    }
  }, [analysisId]));

  useEffect(() => {
    setAnalysis(savedAnalysis.value);
  }, [savedAnalysis.value]);

  useEffect(() => {
    store.setItem(analysisId, analysis);
  }, [ analysisId, analysis ])

  const status = savedAnalysis.pending ? 'in-progress'
  : savedAnalysis.error ? 'error'
  : 'loaded';

  const useSetter = <T extends keyof Analysis>(propertyName: T) => useCallback((value: Analysis[T]) => {
    setAnalysis(_a => _a && ({ ..._a, [propertyName]: value }));
    setHasUnsavedChanges(true);
  }, [propertyName]);

  const setName = useSetter('name');
  const setFilters = useSetter('filters');
  const setVisualizations = useSetter('visualizations');
  const setDerivedVariables = useSetter('derivedVariables');
  const setStarredVariables = useSetter('starredVariables');
  const setVariableUISettings = useSetter('variableUISettings');

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
    status,
    hasUnsavedChanges,
    analysis,
    setName,
    setFilters,
    setVisualizations,
    setDerivedVariables,
    setStarredVariables,
    setVariableUISettings,
    copyAnalysis,
    deleteAnalysis,
    saveAnalysis
  };
}
