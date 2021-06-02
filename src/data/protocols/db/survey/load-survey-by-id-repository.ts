import { SurveyModel } from '@/domain/models/survey';

export interface LoadSurveyByIdRepository {
  loadById(id: string): Promise<LoadSurveyByIdRepository.Reuslt>;
}

export namespace LoadSurveyByIdRepository {
  export type Reuslt = SurveyModel;
}
