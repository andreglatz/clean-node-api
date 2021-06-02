export interface LoadAnswersBySurvey {
  loadAnswers(id: string): Promise<LoadAnswersBySurvey.Reuslt>;
}

export namespace LoadAnswersBySurvey {
  export type Reuslt = string[];
}
