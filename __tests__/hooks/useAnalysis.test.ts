import { act, renderHook } from '@testing-library/react-hooks';
import { useAnalysis, Status } from '../../hooks/useAnalysis';
import { AnalysisApi } from '../../api/analysis-api';
import { ApiRequest, ApiRequestHandler } from 'ebrc-client/util/api';
import { Analysis } from '../../types/analysis';

const key = '123';
function makeRequestHandler(): ApiRequestHandler & { records: Record<string, Analysis> } {
  const records: Record<string, Analysis> = {
    [key]: {
      id: key,
      name: 'My Analysis',
      filters: [],
      derivedVariables: [],
      starredVariables: [],
      variableUISettings: {},
      visualizations: []
    } as Analysis
  }
  return Object.assign(apiHandlerHandler, { records });
  async function apiHandlerHandler<T>(apiRequest: ApiRequest<T>) {
    switch(apiRequest.method.toLowerCase()) {
      case 'get': {
        return apiRequest.transformResponse(records[key]);
      }
      case 'put': {
        records[key] = JSON.parse(apiRequest.body);
        return apiRequest.transformResponse(undefined);
      }
      case 'post': {
        const newKey = Number(key) + Object.keys(records).length;
        records[newKey] = JSON.parse(apiRequest.body);
        return apiRequest.transformResponse({ id: String(newKey) });
      }
      case 'delete': {
        delete records[key];
        return apiRequest.transformResponse(undefined);
      }
      default:
        throw new Error("Unknown method: " + apiRequest.method);
    }
  }
}

let request: ApiRequestHandler & { records: Record<string, Analysis> };
beforeEach(() => {
  request = makeRequestHandler();
})

describe('useAnalysis', () => {

  it('should have the correct status on success path', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    expect(result.current.status === Status.InProgress);
    await waitForValueToChange(() => result.current.status);
    expect(result.current.status === Status.Loaded);
  });

  it('should have the correct status on failure path', async () => {
    const { result, waitForValueToChange } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    expect(result.current.status === Status.InProgress);
    await waitForValueToChange(() => result.current.status);
    expect(result.current.status === Status.Error);
  });

  it('should load an analysis', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    await waitFor(() => result.current.status === Status.Loaded);
    expect(result.current.analysis).toBeDefined();
    expect(result.current.analysis?.name).toBe('My Analysis');
  });

  it('should allow updates', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    await waitFor(() => result.current.status === Status.Loaded)
    act(() => {
      result.current.setName('New Name');
    });
    expect(result.current.analysis?.name).toBe('New Name');
  });

  it('should update store on save', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    await waitFor(() => result.current.status === Status.Loaded)
    act(() => result.current.setName('New Name'));
    expect(result.current.hasUnsavedChanges).toBeTruthy();
    await act(() => result.current.saveAnalysis());
    const analysis = request.records[key];
    expect(analysis.name).toBe('New Name');
    expect(result.current.hasUnsavedChanges).toBeFalsy();
  });

  it('should update store on copy', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    await waitFor(() => result.current.status === Status.Loaded);
    const newId = await result.current.copyAnalysis();
    const newAnalysis = request.records[newId];
    expect(result.current.analysis).toEqual(newAnalysis);
    expect(result.current.analysis).not.toBe(newAnalysis);
  });

  it('should update store on delete', async () => {
    const { result, waitFor } = renderHook(() => useAnalysis(key, AnalysisApi, request));
    await waitFor(() => result.current.status === Status.Loaded);
    await result.current.deleteAnalysis();
    expect(request.records[key]).toBeUndefined();
  });

});
