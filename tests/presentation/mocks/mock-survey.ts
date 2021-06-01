/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyModel } from '@/domain/models/survey';
import { AddSurvey } from '@/domain/usercases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

export class AddSurveySpy implements AddSurvey {
  addSurveyParams: AddSurvey.Params;

  async add(survey: AddSurvey.Params): Promise<void> {
    this.addSurveyParams = survey;
  }
}

export const mockLoadSurvey = (surveysModel: SurveyModel[]): LoadSurveys => {
  class LoadSurveysStub implements LoadSurveys {
    async load(accountId: string): Promise<SurveyModel[]> {
      return surveysModel;
    }
  }

  return new LoadSurveysStub();
};

export const mockLoadSurveyById = (surveyModel: SurveyModel): LoadSurveyById => {
  class LoadSurveyByIdStub implements LoadSurveyById {
    async loadById(id: string): Promise<SurveyModel> {
      return surveyModel;
    }
  }
  return new LoadSurveyByIdStub();
};
