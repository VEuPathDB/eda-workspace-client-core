import * as t from 'io-ts';

const _FilterBase = t.type({
  entityId: t.string,
  variableId: t.string,
});

export const StringSetFilter = t.intersection([_FilterBase, t.type({
  type: t.literal('stringSet'),
  stringSet: t.array(t.string)
})]);

export const NumberSetFilter = t.intersection([_FilterBase, t.type({
  type: t.literal('numberSet'),
  numberSet: t.array(t.number)
})]);

export const DateSetFilter = t.intersection([_FilterBase, t.type({
  type: t.literal('dateSet'),
  dateSet: t.array(t.string)
})]);

export const NumberRangeFilter = t.intersection([_FilterBase, t.type({
  type: t.literal('numberRange'),
  min: t.number,
  max: t.number
})]);

export const DateRangeFilter = t.intersection([_FilterBase, t.type({
  type: t.literal('dateRange'),
  min: t.string,
  max: t.string
})]);

export const Filter = t.union([
  StringSetFilter,
  NumberSetFilter,
  DateSetFilter,
  NumberRangeFilter,
  DateRangeFilter
])