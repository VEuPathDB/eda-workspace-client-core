import React, { useMemo } from 'react';
import { alert } from 'wdk-client/Utils/Platform';
import { useAnalysisState, AnalysisState, AnalysisContext, Status } from '../hooks/useAnalysis';
import { AnalysisApi } from '../api/analysis-api';
import { createFetchApiRequestHandler } from 'ebrc-client/util/api';
import { useWdkStudyRecord, useStudyMetadata, StudyContext, StudyMetadataStore } from '../hooks/useStudy';
import { Analysis } from '../types/analysis';
import { StudyMetadata } from '../types/study';

export interface Props {
  studyId: string;
  analysisId: string;
  children: React.ReactChild | React.ReactChild[];
  className?: string;
}

const mockStudyMetadataStore: StudyMetadataStore = {
  async getStudyMetadata(studyId) {
    return {
      id: studyId,
      name: 'Foo',
      rootEntity: {
        id: 'foo',
        name: 'Foo',
        description: 'foo',
        variablesTree: [],
        children: []
      }
    }
  }
}

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

export function EDAWorkspaceContainer(props: Props) {
  // const analysisState = useAnalysisManager(props.analysisId, AnalysisApi, createFetchApiRequestHandler({ baseUrl: 'foo' }));
  const wdkStudyRecordState = useWdkStudyRecord(props.studyId);
  const { value: studyMetadata } = useStudyMetadata(props.studyId, mockStudyMetadataStore);
  if (analysisState == null || wdkStudyRecordState == null || studyMetadata == null) return null;
  return (
    <AnalysisContext.Provider value={analysisState}>
      <StudyContext.Provider value={{...wdkStudyRecordState, studyMetadata }}>
        <div className={props.className || 'EDAWorkspace'}>
          {props.children}
        </div>
      </StudyContext.Provider>
    </AnalysisContext.Provider>
  );
}
