/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyModel } from '@/domain/models/survey';
import { AddSurvey, AddSurveyParams } from '@/domain/usercases/survey/add-survey';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

export const mockAddSurvey = (): AddSurvey => {
  class AddSurveyStub implements AddSurvey {
    async add(data: AddSurveyParams): Promise<void> {}
  }

  return new AddSurveyStub();
};

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
