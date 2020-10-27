import { createContext, useCallback, useEffect, useState } from 'react';
import { useStateWithHistory, StateWithHistory } from 'wdk-client/Hooks/StateWithHistory';
import { ApiRequestHandler } from 'ebrc-client/util/api';
import { Analysis } from '../types/analysis';
import { usePromise } from './usePromise';
import { AnalysisApi } from '../api/analysis-api';
import { useNonNullableContext } from './useNonNullableContext';

type Setter<T extends keyof Analysis> = (value: Analysis[T]) => void;

export const enum Status {
  InProgress = 'in-progress',
  Loaded = 'loaded',
  NotFound = 'not-found',
  Error = 'error',
}

export type AnalysisState = {
  status: Status;
  hasUnsavedChanges: boolean;
  history: Omit<StateWithHistory<Analysis|undefined>, 'setCurrent'>;
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

export const AnalysisContext = createContext<AnalysisState | undefined>(undefined);

export function useAnalysis() {
  return useNonNullableContext(AnalysisContext);
}

export function useAnalysisState(analysisId: string, api: AnalysisApi, request: ApiRequestHandler): AnalysisState {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const history = useStateWithHistory<Analysis>({
    size: 10,
    onUndo: useCallback(() => setHasUnsavedChanges(true), [setHasUnsavedChanges]),
    onRedo: useCallback(() => setHasUnsavedChanges(true), [setHasUnsavedChanges])
  });
  const savedAnalysis = usePromise(useCallback((): Promise<Analysis> => {
    return request(api.getAnalysis(analysisId));
  }, [analysisId, api, request]));

  useEffect(() => {
    if (savedAnalysis.value) {
      history.setCurrent(savedAnalysis.value);
    }
  }, [savedAnalysis.value]);

  const status = savedAnalysis.pending ? Status.InProgress
               : savedAnalysis.error   ? Status.Error
               : Status.Loaded;

  const useSetter = <T extends keyof Analysis>(propertyName: T) => useCallback((value: Analysis[T]) => {
    history.setCurrent(_a => _a && ({ ..._a, [propertyName]: value }));
    setHasUnsavedChanges(true);
  }, [propertyName]);

  const setName = useSetter('name');
  const setFilters = useSetter('filters');
  const setVisualizations = useSetter('visualizations');
  const setDerivedVariables = useSetter('derivedVariables');
  const setStarredVariables = useSetter('starredVariables');
  const setVariableUISettings = useSetter('variableUISettings');

  const saveAnalysis = useCallback(async () => {
    if (history.current == null) throw new Error("Attempt to save an analysis that hasn't been loaded.");
    await request(api.updateAnalysis(history.current));
    setHasUnsavedChanges(false);
  }, [api, request, history.current])

  const copyAnalysis = useCallback(async () => {
    if (history.current == null) throw new Error("Attempt to copy an analysis that hasn't been loaded.");
    if (hasUnsavedChanges) await saveAnalysis();
    const {id} = await request(api.createAnalysis(history.current));
    return id;
  }, [api, request, history.current, saveAnalysis, hasUnsavedChanges]);

  const deleteAnalysis = useCallback(async () => {
    return request(api.deleteAnalysis(analysisId));
  }, [api, request, analysisId]);

  return {
    status,
    history,
    hasUnsavedChanges,
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
