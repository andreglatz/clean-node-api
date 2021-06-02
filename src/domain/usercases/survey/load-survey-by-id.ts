import { SurveyModel } from '@/domain/models/survey';

export interface LoadSurveyById {
  loadById(id: string): Promise<LoadSurveyById.Reuslt>;
}

export namespace LoadSurveyById {
  export type Reuslt = SurveyModel;
}
