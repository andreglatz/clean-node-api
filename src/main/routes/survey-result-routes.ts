import { Router } from 'express';
import { adaptRoute } from '@/main/adapters/express-route-adapter';
import { makeSaveSurveyResultController } from '@/main/factories/controllers/survey/survey-result/save-survey-result-controller-factory';
import { auth } from '@/main/middlewares/auth/auth';
import { makeLoadSurveyResultController } from '@/main/factories/controllers/survey/survey-result/load-survey-result-controller-factory';

export default (router: Router): void => {
  router.put(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeSaveSurveyResultController())
  );
  router.get(
    '/surveys/:surveyId/results',
    auth,
    adaptRoute(makeLoadSurveyResultController())
  );
};
