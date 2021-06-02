import { LoadAnswersBySurveyRepository } from '@/data/protocols/db/survey/load-answers-by-survey-repository';
import { LoadAnswersBySurvey } from '@/domain/usercases/survey/load-answers-by-survey';

export class DbLoadAnswersBySurvey implements LoadAnswersBySurvey {
  constructor(private readonly loadAnswersBySurveyRepository: LoadAnswersBySurveyRepository) {}

  loadAnswers(id: string): Promise<LoadAnswersBySurvey.Reuslt> {
    return this.loadAnswersBySurveyRepository.loadAnswers(id);
  }
}
