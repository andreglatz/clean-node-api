/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyModel } from '@/domain/models/survey';
import { mockSurveyModel } from '@/domain/test';
import { AddSurvey } from '@/domain/usercases/survey/add-survey';
import { CheckSurveyById } from '@/domain/usercases/survey/check-survey-by-id';
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

export class CheckSurveyByIdSpy implements CheckSurveyById {
  result = true;

  async checkById(id: string): Promise<CheckSurveyById.Reuslt> {
    return this.result;
  }
}

export class LoadSurveyByIdSpy implements LoadSurveyById {
  result = mockSurveyModel();

  async loadById(id: string): Promise<LoadSurveyById.Reuslt> {
    return this.result;
  }
}
