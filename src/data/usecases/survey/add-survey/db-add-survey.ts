/* eslint-disable no-useless-constructor */
import { AddSurvey, AddSurveyRepository } from './db-add-survey-protocols';

export class DbAddSurvey implements AddSurvey {
  constructor(private readonly addSurveyRepository: AddSurveyRepository) {}

  async add(surveyData: AddSurvey.Params): Promise<AddSurvey.Result> {
    await this.addSurveyRepository.add(surveyData);
    return null;
  }
}
