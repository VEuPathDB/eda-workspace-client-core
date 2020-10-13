import { act, renderHook } from '@testing-library/react-hooks';
import { TypeOf } from 'io-ts';
import { useAnalysis } from '../../hooks/useAnalysis';
import { makeMemoryStore } from '../../stores/memory-store';
import { Analysis } from '../../types/analysis';

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

  it('should have the correct status on success path', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(store, key));
    expect(result.current.status === 'in-progress');
    await waitForValueToChange(() => result.current.status);
    expect(result.current.status === 'loaded');
  });

  it('should have the correct status on failure path', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(store, 'foo'));
    expect(result.current.status === 'in-progress');
    await waitForValueToChange(() => result.current.status);
    expect(result.current.status === 'error');
  });

  it('should load an analysis', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(store, key));
    await waitFor(() => result.current.status === 'loaded');
    expect(result.current.analysis).toBeDefined();
    expect(result.current.analysis?.name).toBe('My Analysis');
  });

  it('should allow updates', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(store, key));
    await waitFor(() => result.current.status === 'loaded')
    act(() => {
      result.current.setName('New Name');
    });
    expect(result.current.analysis?.name).toBe('New Name');
  });

  it('should update store on save', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(store, key));
    await waitFor(() => result.current.status === 'loaded')
    act(() => result.current.setName('New Name'));
    expect(result.current.hasUnsavedChanges).toBeTruthy();
    await act(() => result.current.saveAnalysis());
    const analysis = await store.get(key);
    expect(analysis.name).toBe('New Name');
    expect(result.current.hasUnsavedChanges).toBeFalsy();
  });

  it('should update store on copy', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(store, key));
    await waitFor(() => result.current.status === 'loaded');
    const newId = await result.current.copyAnalysis();
    const newAnalysis = await store.get(newId);
    expect(result.current.analysis).toEqual(newAnalysis);
    expect(result.current.analysis).not.toBe(newAnalysis);
  });

  it('should update store on delete', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(store, key));
    await waitFor(() => result.current.status === 'loaded');
    await result.current.deleteAnalysis();
    expect(store.get(key)).rejects.toThrow();
  });

});
