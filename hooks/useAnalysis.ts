import { useCallback, useEffect, useState } from 'react';
import { useStateWithHistory } from 'wdk-client/Hooks/StateWithHistory';
import { ApiRequestHandler } from 'ebrc-client/util/api';
import { Analysis } from '../types/analysis';
import { usePromise } from './usePromise';
import { AnalysisApi } from '../api/analysis-api';

type Setter<T extends keyof Analysis> = (value: Analysis[T]) => void;

export const enum Status {
  InProgress = 'in-progress',
  Error = 'error',
  Loaded = 'loaded',
  NotFound = 'not-found'
}

type Return = {
  status: Status;
  hasUnsavedChanges: boolean;
  analysis: Analysis | undefined;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
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

export function useAnalysis(analysisId: string, api: AnalysisApi, request: ApiRequestHandler): Return {
  const { state: analysis, set: setAnalysis, undo: _undo, redo: _redo, canUndo, canRedo } = useStateWithHistory<Analysis>({ size: 10 });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const savedAnalysis = usePromise(useCallback((): Promise<Analysis> => {
    return request(api.getAnalysis(analysisId));
  }, [analysisId, api, request]));

  useEffect(() => {
    if (savedAnalysis.value) {
      setAnalysis(savedAnalysis.value);
    }
  }, [savedAnalysis.value]);

  const status = savedAnalysis.pending ? Status.InProgress
               : savedAnalysis.error   ? Status.Error
               : Status.Loaded;

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

  const undo = useCallback(() => {
    _undo();
    setHasUnsavedChanges(true);
  }, [_undo]);

  const redo = useCallback(() => {
    _redo();
    setHasUnsavedChanges(true);
  }, [_undo]);

  const saveAnalysis = useCallback(async () => {
    if (analysis == null) throw new Error("Attempt to save an analysis that hasn't been loaded.");
    await request(api.updateAnalysis(analysis));
    setHasUnsavedChanges(false);
  }, [api, request, analysis])

  const copyAnalysis = useCallback(async () => {
    if (analysis == null) throw new Error("Attempt to copy an analysis that hasn't been loaded.");
    if (hasUnsavedChanges) await saveAnalysis();
    const {id} = await request(api.createAnalysis(analysis));
    return id;
  }, [api, request, analysis, saveAnalysis, hasUnsavedChanges]);

  const deleteAnalysis = useCallback(async () => {
    return request(api.deleteAnalysis(analysisId));
  }, [api, request, analysisId]);

  return {
    status,
    hasUnsavedChanges,
    analysis,
    undo,
    redo,
    canUndo,
    canRedo,
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
