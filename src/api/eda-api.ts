import { array } from "io-ts";
import { Study, StudyOverview } from "../types/study";

const Studies = array(StudyOverview);

export function getStudies(serviceUrl: string) {
  return [
    Studies,
    serviceUrl + '/studies'
  ] as const;
}

export function getStudy(serviceUrl: string, studyId: string) {
  return [
    Study,
    `${serviceUrl}/studies/${studyId}`
  ] as const;
}
