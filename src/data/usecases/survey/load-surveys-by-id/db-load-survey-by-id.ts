/* eslint-disable no-useless-constructor */
import {
  SurveyModel,
  LoadSurveyById,
  LoadSurveyByIdRepository,
} from './db-load-survey-by-id-protocols';

export class DbLoadSurveyById implements LoadSurveyById {
  constructor(private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository) {}

  loadById(id: string): Promise<LoadSurveyById.Reuslt> {
    return this.loadSurveyByIdRepository.loadById(id);
  }
}
