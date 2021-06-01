import { SurveyModel } from '@/domain/models/survey';

export interface AddSurvey {
  add(survey: AddSurvey.Params): Promise<AddSurvey.Result>;
}

export namespace AddSurvey {
  export type Params = Omit<SurveyModel, 'id'>;
  export type Result = void;
}
