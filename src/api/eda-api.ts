import { array } from "io-ts";
import { Study, StudyOverview } from "../types/study";

const Studies = array(StudyOverview);

/*
Questions
=========

* What is the use of `/studies/{studyId}/{entityId}` since `/studies/{studyId}` includes rootEntity?
* What is the response type of `POST /studies/{study-id}/{entity-id}`?

*/

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
