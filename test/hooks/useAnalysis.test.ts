import { act, renderHook } from '@testing-library/react-hooks';
import { TypeOf } from 'io-ts';
import { useAnalysis } from '../../src/hooks/useAnalysis';
import { makeMemoryStore } from '../../src/stores/memory-store';
import { Analysis } from '../../src/types/analysis';

const store = makeMemoryStore<TypeOf<typeof Analysis>>();
const key = '123';
beforeEach(() => {
  return store.put(key, {
    name: 'My Analysis',
    filters: [],
    derivedVariables: [],
    starredVariables: [],
    variableUISettings: {},
    visualizations: []
  });
})

describe('useAnalysis', () => {

  it('should load an analysis', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(store, key));
    await waitForValueToChange(() => result.current.analysis);
    expect(result.current.analysis).toBeDefined();
    expect(result.current.analysis?.name).toBe('My Analysis');
  });

  it('should allow updates', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(store, key));
    await waitForValueToChange(() => result.current.analysis)
    act(() => {
      result.current.setName('New Name');
    });
    expect(result.current.analysis?.name).toBe('New Name');
  });

  it('should update store on save', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(store, key));
    await waitForValueToChange(() => result.current.analysis)
    act(() => result.current.setName('New Name'));
    expect(result.current.hasUnsavedChanges).toBeTruthy();
    await act(() => result.current.saveAnalysis());
    const analysis = await store.get(key);
    expect(analysis.name).toBe('New Name');
  });

});