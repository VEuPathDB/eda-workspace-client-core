import * as t from 'wdk-client/Utils/Json';

// VariablesTree
// -------------

const _VariablesTreeBase = t.record({
  id: t.string,
  name: t.string,
  description: t.string,
  type: t.string,
});

export type VariablesTree = t.Unpack<typeof VariablesTree>;
export const VariablesTree = t.combine(_VariablesTreeBase, t.record({
  children: t.optional(t.arrayOf(_VariablesTreeBase))
}));


// StudyEntity
// -----------

const _StudyEntityBase = t.record({
  id: t.string,
  name: t.string,
  description: t.string,
  variablesTree: t.arrayOf(VariablesTree),
});

export type StudyEntity = t.Unpack<typeof StudyEntity>;
export const StudyEntity = t.combine(_StudyEntityBase, t.record({
  children: t.optional(t.arrayOf(_StudyEntityBase))
}));


// Study
// -----

export type StudyOverview = t.Unpack<typeof StudyOverview>;
export const StudyOverview = t.record({
  id: t.string,
  name: t.string,
});

export type Study = t.Unpack<typeof Study>;
export const Study = t.combine(StudyOverview, t.record({
  rootEntity: StudyEntity
}));
