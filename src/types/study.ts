import * as t from 'io-ts';

// VariablesTree
// -------------

const _VariablesTreeBase = t.type({
  id: t.string,
  name: t.string,
  description: t.string,
  type: t.string,
});

export const VariablesTree = t.intersection([_VariablesTreeBase, t.partial({
  children: t.array(_VariablesTreeBase)
})]);


// StudyEntity
// -----------

const _StudyEntityBase = t.type({
  id: t.string,
  name: t.string,
  description: t.string,
  variablesTree: t.array(VariablesTree),
});

export const StudyEntity = t.intersection([_StudyEntityBase, t.partial({
  children: t.array(_StudyEntityBase)
})]);


// Study
// -----

export const StudyOverview = t.type({
  id: t.string,
  name: t.string,
});

export const Study = t.intersection([StudyOverview, t.type({
  rootEntity: StudyEntity
})]);
