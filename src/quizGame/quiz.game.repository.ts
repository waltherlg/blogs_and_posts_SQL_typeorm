import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDbType, Questions, UpdateQuestionImputModelType } from './quiz.questions.types';
import { DeepPartial, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { QuizGameDbType, QuizGames, questionGameType } from './quiz.game.types';
import { transform } from 'typescript';

@Injectable()
export class QuizGamesRepository {
  constructor(
    @InjectRepository(QuizGames)
    private readonly quizGamesRepository: Repository<QuizGames>,
  ) {}

  async createQuizGame(quizGameDto: QuizGameDbType): Promise<string> {
    const result = await this.quizGamesRepository.save(quizGameDto);
    return result.quizGameId;
  }
  
6}
