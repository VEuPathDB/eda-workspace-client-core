// Stubs - To be filled in later
interface Filter {
}

interface DataPoints {
}

interface Variable {
}

interface RecordDetailCollection {
}

interface ReactComponent<Props> {
}


/**
 * Settings for the Workspace
 *
 * The Workspace is made up of four pieces:
 *   - Map view
 *   - Filtering system
 *   - Collection of record details
 *   - Summary plots
 *
 * The things that can be customized are:
 *   - How to get record details
 *   - How to get plot data
 *   - RecordDetails component
 *   - Plot component
 *   - Filter component
 */
interface WorkspaceSettings {
  getRecordDetails(recordType: string, filters: Filter[]): Promise<RecordDetailCollection>;
  getDataPoints(plotType: string, fitlers: Filter[], variables: Variable[]): Promise<DataPoints>;
  components: {
    RecordDetails: ReactComponent<{ recordDetailCollection: RecordDetailCollection }>;
    Plot: ReactComponent<{ plotType: string; dataPoints: DataPoints }>;
    Filter: ReactComponent<{ variable: Variable; filter?: Filter }>;
  }
}
