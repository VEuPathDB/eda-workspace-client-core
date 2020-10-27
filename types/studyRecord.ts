import * as t from 'wdk-client/Utils/Json';
import { PrimaryKey } from 'ebrc-client/components/EDAWorkspace/Types';

export type StudyRecord = t.Unpack<typeof StudyRecord>;
export const StudyRecord = t.record({
  displayName: t.string,
  id: PrimaryKey,
  recordClassName: t.string,
  attributes: t.objectOf(t.oneOf(t.string, t.nullValue)),
  tables: t.record({})
})
