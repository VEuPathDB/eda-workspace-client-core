import * as t from 'io-ts';
import { Filter } from './filter';

export const DerviedVariable = t.unknown;

export const VariableUISetting = t.unknown;

export const Visualization = t.unknown;

export const Analysis = t.type({
  name: t.string,
  filters: t.array(Filter),
  derivedVariables: t.array(DerviedVariable),
  starredVariables: t.array(t.string),
  variableUISettings: t.record(t.string, VariableUISetting),
  visualizations: t.array(Visualization)
});
