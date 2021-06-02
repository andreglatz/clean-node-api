export interface CheckSurveyById {
  checkById(id: string): Promise<CheckSurveyById.Reuslt>;
}

export namespace CheckSurveyById {
  export type Reuslt = boolean;
}
