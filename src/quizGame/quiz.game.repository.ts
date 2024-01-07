import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionDbType,
  Questions,
  UpdateQuestionImputModelType,
} from './quiz.questions.types';
import { DeepPartial, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import {
  QuizGameDbType,
  QuizGames,
  enumStatusGameType,
  questionGameType,
} from './quiz.game.types';
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

  async addSecondPlayerToGame(quizGameId, player2): Promise<boolean> {
    const result = await this.quizGamesRepository.update(
      { quizGameId: quizGameId },
      {
        player2: player2,
        startGameDate: new Date(),
        status: enumStatusGameType.Active,
      },
    );
    return result.affected > 0;
  }

  async getPandingGame() {
    const gameQueryBuilder =
      this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
      .select([
        'game',
        'player1.userId',
        'player1.login',
        'player2.userId',
        'player2.login',
        'question1',
        'question2',
        'question3',
        'question4',
        'question5',
      ])
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.question1', 'question1')
      .leftJoin('game.question2', 'question2')
      .leftJoin('game.question3', 'question3')
      .leftJoin('game.question4', 'question4')
      .leftJoin('game.question5', 'question5')

      .where(`game.status = 'PendingSecondPlayer'`);
    const game = await gameQueryBuilder.getOne();
    return game;
  }

  //TODO: get attive game
  async getActiveGameByUserId(userId) {
    if (!isValidUUID(userId)) {
      return null;
    }
    const gameQueryBuilder =
      this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
      .select([
        'game',
        'player1.userId',
        'player1.login',
        'player2.userId',
        'player2.login',
        'question1',
        'question2',
        'question3',
        'question4',
        'question5',
      ])
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.question1', 'question1')
      .leftJoin('game.question2', 'question2')
      .leftJoin('game.question3', 'question3')
      .leftJoin('game.question4', 'question4')
      .leftJoin('game.question5', 'question5')

      .where('game.player1Id = :userId', { userId: userId })
      .andWhere(`game.status = 'Active'`);
    const game = await gameQueryBuilder.getOne();

    return game;
  }
}
