import { adaptResolver } from '@/main/adapters';
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey/survey-result/load-survey-result-controller-factory';
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/survey-result/save-survey-result-controller-factory';

export default {
  Query: {
    surveyResult: async (parent: any, args: any) =>
      adaptResolver(makeLoadSurveyResultController(), args),
  },

  Mutation: {
    saveSurveyResult: async (parent: any, args: any) =>
      adaptResolver(makeSaveSurveyResultController(), args),
  },
};
