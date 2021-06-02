import { SurveyModel } from '@/domain/models/survey';

export interface CheckSurveyByIdRepository {
  checkById(id: string): Promise<CheckSurveyByIdRepository.Reuslt>;
}

export namespace CheckSurveyByIdRepository {
  export type Reuslt = boolean;
}
