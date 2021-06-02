export interface LoadAnswersBySurveyRepository {
  loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Reuslt>;
}

export namespace LoadAnswersBySurveyRepository {
  export type Reuslt = string[];
}
