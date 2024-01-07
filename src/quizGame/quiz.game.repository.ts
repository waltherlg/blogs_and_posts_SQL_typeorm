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
//TODO: get attive game
  async getActiveGameByUserId(userId){
    if (!isValidUUID(userId)) {
      return null;
    }
    const gameQueryBuilder = this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
    .select([
      'game.quizGameId',
      'player1.userId',
      'player1.login',
      'player2.userId',
      'player2.login',
      'game.question1Id',
    ])
    .leftJoin('game.player1', 'player1')
    .leftJoin('game.player2', 'player2')
    .leftJoin('game.Questions1', 'Questions1')
    .leftJoin('game.Questions2', 'Questions2')
    .leftJoin('game.Questions3', 'Questions3')
    .leftJoin('game.Questions4', 'Questions4')
    .leftJoin('game.Questions5', 'Questions5')

    .where('game.player1Id = :userId', { userId: userId })
    const game = await gameQueryBuilder.getOne();
    console.log(game);
    
    return game

  }
  
 }
