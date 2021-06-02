import { CheckSurveyByIdRepository } from '@/data/protocols/db/survey/check-survey-by-id-repository';
import { CheckSurveyById } from '@/domain/usercases/survey/check-survey-by-id';

export class DbCheckSurveyById implements CheckSurveyById {
  constructor(private readonly checkSurveyByIdRepository: CheckSurveyByIdRepository) {}

  checkById(id: string): Promise<CheckSurveyById.Reuslt> {
    return this.checkSurveyByIdRepository.checkById(id);
  }
}
