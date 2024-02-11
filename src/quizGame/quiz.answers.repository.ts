import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuizAnswers } from './quiz.answers.types';
import { Repository } from 'typeorm';

@Injectable()
export class QuizAnswersRepository {
  constructor(
    @InjectRepository(QuizAnswers)
    private readonly quizAnswersRepository: Repository<QuizAnswers>,
  ) {}

  //TODO настроить return
  async saveAnswerInGame(answer): Promise<boolean> {
    const result = await this.quizAnswersRepository.save(answer);
    return !!result;
  }
}
