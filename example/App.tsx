import { TypeOf } from "io-ts";
import { useAnalysis } from "../src/hooks/useAnalysis";
// The following is a rough sketch of what the EDA Workspace App will look like.
//
// Hooks
// -----
// * *useStudy* - fetches study record from backend
// * *useAnalysis* - tracks state, provides updaters and actions. this can be composed of smaller hooks
// * *useBackendSync* - synchronizes state with backend

import { useStudy } from "../src/hooks/useStudy";
import { Analysis } from "../src/types/analysis";
import { Study } from "../src/types/study";
import { Store } from "../src/utils/store";

type Study = TypeOf<typeof Study>;
type Analysis = TypeOf<typeof Analysis>;

//
type Props = {
  studyStore: Store<Study, 'get'>;
  analysisStore: Store<Analysis>;
  studyId: string;
  analysisId: string;
}

function App(props: Props) {
  const { analysisId, studyId, analysisStore, studyStore } = props;

  const {
    variableId,
    visualizationId
  } = useParams();

  const study = useStudy(studyStore, studyId);

  const {

    // error, not-found, loaded, in-progress
    status,

    // current config
    analysis,

    // updaters
    setName,
    setFilters,
    setVisualizations,
    setDerivedVariables,
    setStarredVariables,
    setVariableUISettings,

    // actions
    copyAnalysis,
    deleteAnalysis,
    saveAnalysis
  } = useAnalysis(analysisStore, analysisId);

  // We can show an indicator based on this status
  const syncStatus = useBackendSync(analysis, {
    updateIntervalSeconds: 10,
    doUpdate: saveAnalysis
  });

  return (
    <div className="eda-workspace">
      <Header
        study={study}
        analysis={analysis}
        copy={copyAnalysis}
        updateName={setName}
        delete={deleteAnalysis}
      />
      <Subsetting
        activeVariableId={variableId}
        variables={study.variables}

        derivedVariables={analysis.derivedVariables}
        starredVariable={analysis.starredVariable}
        filters={analysis.filters}
        variableUISettings={analysis.variableUISettings}

        setFilters={setFilters}
        setDerivedVariables={setDerivedVariables}
        setStarredVariables={setStarredVariables}
        setVariableUISettings={setVariableUISettings}
      />
      <Visualizations
        visualizationId={visualizationId}
        visualizationTypes={study.visualizationTypes}
        variables={study.variables}

        visualizations={analysis.visualizations}
        derivedVariables={analysis.derivedVariables}
        starredVariable={analysis.starredVariable}
        filters={analysis.filters}

        setVisualizations={setVisualizations}
      />
    </div>
  );
}



// And this is what the MapVEu app will look like
function MapVEuApp(props: { studyId: string }) {
  const study = useStudy(studyId);

  return (
    <div className="mapveu">
      <Map/>
      <Subsetting/>
    </div>
  );
}
