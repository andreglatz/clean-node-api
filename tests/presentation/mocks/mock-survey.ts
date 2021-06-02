/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyModel } from '@/domain/models/survey';
import { AddSurvey } from '@/domain/usercases/survey/add-survey';
import { CheckSurveyById } from '@/domain/usercases/survey/check-survey-by-id';
import { LoadAnswersBySurvey } from '@/domain/usercases/survey/load-answers-by-survey';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

import faker from 'faker';

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

export class LoadAnsersBySurveySpy implements LoadAnswersBySurvey {
  result = [faker.random.word(), faker.random.word()];

  async loadAnswers(id: string): Promise<LoadAnswersBySurvey.Reuslt> {
    return this.result;
  }
}
