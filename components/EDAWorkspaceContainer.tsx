import React from 'react';
import { alert } from 'wdk-client/Utils/Platform';
import { useAnalysisState, AnalysisState, AnalysisContext, Status } from '../hooks/useAnalysis';
import { AnalysisApi } from '../api/analysis-api';
import { createFetchApiRequestHandler } from 'ebrc-client/util/api';
import { useStudyManager, StudyContext } from '../hooks/useStudyRecord';
import { Analysis } from '../types/analysis';

export interface Props {
  studyId: string;
  analysisId: string;
  className?: string;
  children: React.ReactChild | React.ReactChild[];
}

export function EDAWorkspaceContainer(props: Props) {
  // const analysisState = useAnalysisManager(props.analysisId, AnalysisApi, createFetchApiRequestHandler({ baseUrl: 'foo' }));
  const analysis: Analysis = {
    id: '123',
    name: 'Unnamed Analysis',
    filters: [],
    visualizations: [],
    derivedVariables: [],
    starredVariables: [],
    variableUISettings: {}
  };
  function todo(): any {
    alert('TODO', 'This feature is not yet implemented.');
  }
  const analysisState: AnalysisState  = {
    history: {
      canRedo: false,
      canUndo: false,
      current: analysis,
      undo: todo,
      redo: todo,
    },
    status: Status.Loaded,
    hasUnsavedChanges: false,
    setName: todo,
    setFilters: todo,
    setVisualizations: todo,
    setDerivedVariables: todo,
    setStarredVariables: todo,
    setVariableUISettings: todo,
    copyAnalysis: todo,
    saveAnalysis: todo,
    deleteAnalysis: todo
  }
  const studyState = useStudyManager(props.studyId);
  if (analysisState == null || studyState == null) return null;
  return (
    <AnalysisContext.Provider value={analysisState}>
      <StudyContext.Provider value={studyState}>
        <div className={props.className || 'EDAWorkspace'}>
          {props.children}
        </div>
      </StudyContext.Provider>
    </AnalysisContext.Provider>
  );
}
