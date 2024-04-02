import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import {
  QuizGameDbType,
  QuizGames,
  enumStatusGameType,
  outputGameQuizType,
} from './quiz.game.types';
import { QuizAnswers, QuizAnwswerDbType } from './quiz.answers.types';
import { PaginationOutputModel } from 'src/models/types';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';

@Injectable()
export class QuizGamesRepository {
  constructor(
    @InjectRepository(QuizGames)
    private readonly quizGamesRepository: Repository<QuizGames>, //private readonly quizAnswersRepository: Repository<QuizAnswers>
  ) {}

  async createQuizGame(quizGameDto: QuizGameDbType): Promise<string> {
    const result = await this.quizGamesRepository.save(quizGameDto);

    return result.quizGameId;
  }

  async saveGameChange(game: QuizGames): Promise<boolean> {
    const result = await this.quizGamesRepository.save(game);

    if (result) {
      return true;
    } else {
      return false;
    }
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
        'questions',
      ])
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.questions', 'questions')

      .where(`game.status = 'PendingSecondPlayer'`);
    const game = await gameQueryBuilder.getOne();
    return game;
  }

  async getGameByIdAnyStatus(gameId): Promise<QuizGames | null> {
    if (!isValidUUID(gameId)) {
      return null;
    }
    const gameQueryBuilder =
      this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
      .select([
        'game',
        'answers',
        'player1.userId',
        'player1.login',
        'player2.userId',
        'player2.login',
        'questions',
      ])
      .leftJoin('game.answers', 'answers')
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.questions', 'questions')
      .where('game.quizGameId = :gameId', { gameId: gameId })
      .orderBy('questions.createdAt', 'ASC');
    const game: QuizGames = await gameQueryBuilder.getOne();
    if (!game) {
      return null;
    }
    return game;
  }

  //TODO: get attive game (add answers)
  async getActiveGameByUserId(userId): Promise<QuizGames | null> {
    if (!isValidUUID(userId)) {
      return null;
    }
    const gameQueryBuilder =
      this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
      .select([
        'game',
        'answers',
        'player1.userId',
        'player1.login',
        'player2.userId',
        'player2.login',
        'questions',
      ])
      .leftJoin('game.answers', 'answers')
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.questions', 'questions')

      .where('(game.player1Id = :userId  OR game.player2Id = :userId)', {
        userId: userId,
      })
      .andWhere(`game.status = 'Active' OR game.status = 'PendingSecondPlayer'`)
      .orderBy('questions.createdAt', 'ASC');
    const game: QuizGames = await gameQueryBuilder.getOne();
    if (!game) {
      return null;
    }
    return game;
  }

  //TODO: need maping
  async getGameForConnectUseCase(gameId, userId) {
    if (!isValidUUID(gameId)) {
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
        'questions',
      ])
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.questions', 'questions')

      .where('game.quizGameId = :gameId', { gameId: gameId });
    const game = await gameQueryBuilder.getOne();
    return game;
  }

  //TODO: need remove before prod
  async getFullGameById(gameId) {
    if (!isValidUUID(gameId)) {
      return null;
    }
    const gameQueryBuilder =
      this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
      .select([
        'game',
        'answers',
        'player1.userId',
        'player1.login',
        'player2.userId',
        'player2.login',
        'questions',
      ])
      .leftJoin('game.answers', 'answers')
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.questions', 'questions')

      .where('game.quizGameId = :gameId', { gameId: gameId });
    const game = await gameQueryBuilder.getOne();
    return game;
  }

  async isUserHaveUnfinishedGame(userId): Promise<boolean> {
    const game = await this.quizGamesRepository
      .createQueryBuilder('game')
      .where(
        "(game.player1Id = :userId AND (game.status = 'Active' OR game.status = 'PendingSecondPlayer')) OR " +
          "(game.player2Id = :userId AND game.status = 'Active')",
      )
      .setParameter('userId', userId)
      .getOne();
    return !!game;
  }

  async getAllGames(userId?) {
    const queryBuilder = this.quizGamesRepository.createQueryBuilder('game');
    queryBuilder
      .select([
        'game',
        'answers',
        'player1.userId',
        'player1.login',
        'player2.userId',
        'player2.login',
        'questions',
      ])
      .leftJoin('game.answers', 'answers')
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('game.questions', 'questions');

    if (userId) {
      queryBuilder.where(
        '(game.player1Id = :userId  OR game.player2Id = :userId)',
        {
          userId: userId,
        },
      );
    }

    const games = await queryBuilder.getMany();
    return games.map((game) => game.returnForPlayer());
  }

  //TODO: in progress
  async GetCurrentUserStatistic(userId){
    if (!isValidUUID(userId)) {
      return null;
    }
    const queryBuilder = this.quizGamesRepository.createQueryBuilder('game')
    queryBuilder
    .select([
      'game',
      'answers',
      'player1.userId',
      'player1.login',
      'player2.userId',
      'player2.login',
      'questions',
    ])
    .leftJoin('game.answers', 'answers')
    .leftJoin('game.player1', 'player1')
    .leftJoin('game.player2', 'player2')
    .leftJoin('game.questions', 'questions')
    .where('(game.player1Id = :userId  OR game.player2Id = :userId)',
      {
        userId: userId,
      },
    );

    const games = await queryBuilder.getMany();

    //заглушки
    return 'user statistic'
  }

  async getAllGamesForCurrentUser(mergedQueryParams, userId): Promise<PaginationOutputModel<outputGameQuizType>> | null{
    if (!isValidUUID(userId)) {
      return null;
    }
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.quizGamesRepository.createQueryBuilder('game')
    queryBuilder
    .select([
      'game',
      'answers',
      'player1.userId',
      'player1.login',
      'player2.userId',
      'player2.login',
      'questions',
    ])
    .leftJoin('game.answers', 'answers')
    .leftJoin('game.player1', 'player1')
    .leftJoin('game.player2', 'player2')
    .leftJoin('game.questions', 'questions')
    .where('(game.player1Id = :userId  OR game.player2Id = :userId)',
      {
        userId: userId,
      },
    );

    const gamesCount = await queryBuilder.getCount();

    const games = await queryBuilder
    .orderBy(`"${sortBy}"`, sortDirection)
    .limit(pageSize)
    .offset(skipPage)
    .getMany()

    const gamesForOutput = games.map((game) => game.returnForPlayer())

    const pageCount = Math.ceil(gamesCount / pageSize)
    const outputGames = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: gamesCount,
      items: gamesForOutput,
    }
    return outputGames

  }
}
