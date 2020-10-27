import { createContext } from 'react';
import { useWdkServiceWithRefresh } from 'wdk-client/Hooks/WdkServiceHook';
import { preorderSeq } from 'wdk-client/Utils/TreeUtils';
import { getTargetType, getScopes, getNodeId } from 'wdk-client/Utils/CategoryUtils';
import { RecordClass, RecordInstance } from 'wdk-client/Utils/WdkModel';
import { useNonNullableContext } from './useNonNullableContext';

const STUDY_RECORD_CLASS_NAME = 'dataset';

interface StudyState {
  studyRecordClass: RecordClass;
  studyRecord: RecordInstance;
}
export const StudyContext = createContext<StudyState | undefined>(undefined);

export function useStudyRecord() {
  return useNonNullableContext(StudyContext);
}

export function useStudyManager(studyId: string) {
  return useWdkServiceWithRefresh(async wdkService => {
    const studyRecordClass = await wdkService.findRecordClass(STUDY_RECORD_CLASS_NAME);
    const ontology = await wdkService.getOntology((await wdkService.getConfig()).categoriesOntologyName);
    const attributes = preorderSeq(ontology.tree)
      .filter(node => getTargetType(node) === 'attribute' && getScopes(node).includes('eda'))
      .map(getNodeId)
      .toArray();
    const studyRecord = await wdkService.getRecord(
      STUDY_RECORD_CLASS_NAME,
      [ { name: 'dataset_id', value: studyId } ],
      { attributes }
    );
    return {
      studyRecord,
      studyRecordClass
    };
  }, [studyId]);
}
