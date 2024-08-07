import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { v4 as uuidv4 } from 'uuid';
import {
  QuizGameDbType,
  QuizGames,
  enumStatusGameType,
  outputGameQuizType,
} from './quiz.game.types';
import {
  QuizAnswers,
  QuizAnwswerDbType,
  enumAnswerGameStatus,
} from './quiz.answers.types';
import { PaginationOutputModel } from 'src/models/types';
import {
  delayFunction,
  sortDirectionFixer,
  swapPlayerNumber,
} from 'src/helpers/helpers.functions';
import {
  PlayerStatistic,
  topPlayerOutputType,
} from './quiz.game.statistic.type';

@Injectable()
export class QuizGamesRepository {
  constructor(
    @InjectRepository(QuizGames)
    private readonly quizGamesRepository: Repository<QuizGames>, //private readonly quizAnswersRepository: Repository<QuizAnswers>
    @InjectRepository(PlayerStatistic)
    private readonly playerStatisticRepository: Repository<PlayerStatistic>,
  ) {}

  async createQuizGame(quizGameDto: QuizGameDbType): Promise<string> {
    const result = await this.quizGamesRepository.save(quizGameDto);

    return result.quizGameId;
  }

  async saveGameChange(game: QuizGames): Promise<boolean> {
    const result = await this.quizGamesRepository.save(game);
    game.player1.PlayerStatistic.recountAvgScore();
    game.player2.PlayerStatistic.recountAvgScore();
    const resultStatisticSave = await this.playerStatisticRepository.save([
      game.player1.PlayerStatistic,
      game.player2.PlayerStatistic,
    ]);

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
        'player1',
        'PlayerStatistic1',
        'player2',
        'PlayerStatistic2',
        'questions',
      ])
      .leftJoin('game.answers', 'answers')
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('player1.PlayerStatistic', 'PlayerStatistic1')
      .leftJoin('player2.PlayerStatistic', 'PlayerStatistic2')

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

  //TODO: addTypes
  async GetCurrentUserStatistic(userId) {
    if (!isValidUUID(userId)) {
      return null;
    }
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
      .leftJoin('game.questions', 'questions')
      .where('(game.player1Id = :userId  OR game.player2Id = :userId)', {
        userId: userId,
      });

    const games = await queryBuilder.getMany();

    const userStatistic = {
      sumScore: 0,
      avgScores: 0,
      gamesCount: 0,
      winsCount: 0,
      lossesCount: 0,
      drawsCount: 0,
    };

    function updateStatistics(playerStatus) {
      switch (playerStatus) {
        case 'win':
          userStatistic.winsCount++;
          break;
        case 'lose':
          userStatistic.lossesCount++;
          break;
        case 'draw':
          userStatistic.drawsCount++;
          break;
        default:
          console.log('wrong status');
      }
    }

    games.forEach((game) => {
      const currentGameStatistic =
        game.getStatisticForCurrentGameAndUser(userId);
      userStatistic.sumScore += currentGameStatistic.score;
      updateStatistics(currentGameStatistic.gameStatus);
    });
    userStatistic.gamesCount = games.length;
    if (userStatistic.gamesCount !== 0) {
      const avgScore = userStatistic.sumScore / userStatistic.gamesCount;
      userStatistic.avgScores = parseFloat(avgScore.toFixed(2));

      if (userStatistic.avgScores % 1 === 0) {
        userStatistic.avgScores = Math.round(userStatistic.avgScores);
      }
    } else {
      userStatistic.avgScores = 0;
    }

    return userStatistic;
  }

  async getAllGamesForCurrentUser(
    mergedQueryParams,
    userId,
  ): Promise<PaginationOutputModel<outputGameQuizType>> | null {
    if (!isValidUUID(userId)) {
      return null;
    }
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

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
      .leftJoin('game.questions', 'questions')
      .where('(game.player1Id = :userId  OR game.player2Id = :userId)', {
        userId: userId,
      });

    const gamesCount = await queryBuilder.getCount();

    const games = await queryBuilder
      .orderBy(`game.${sortBy}`, sortDirection)
      //.limit(pageSize)
      .take(pageSize)
      .offset(skipPage)
      .getMany();

    const gamesForOutput = games.map((game) => game.returnForPlayer());

    const pageCount = Math.ceil(gamesCount / pageSize);
    const outputGames = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: gamesCount,
      items: gamesForOutput,
    };
    return outputGames;
  }

  async finishGameAfter10sec(gameId, userId) {
    if (!isValidUUID(gameId)) {
      return null;
    }
    const gameQueryBuilder =
      this.quizGamesRepository.createQueryBuilder('game');
    gameQueryBuilder
      .select([
        'game',
        'answers',
        'player1',
        'PlayerStatistic1',
        'player2',
        'PlayerStatistic2',
        'questions',
      ])
      .leftJoin('game.answers', 'answers')
      .leftJoin('game.player1', 'player1')
      .leftJoin('game.player2', 'player2')
      .leftJoin('player1.PlayerStatistic', 'PlayerStatistic1')
      .leftJoin('player2.PlayerStatistic', 'PlayerStatistic2')
      .leftJoin('game.questions', 'questions')

      .where('(game.quizGameId = :gameId)', {
        gameId: gameId,
      })
      .orderBy('questions.createdAt', 'ASC');

    await delayFunction(10000);

    const game: QuizGames = await gameQueryBuilder.getOne();
    if (!game) {
      return null;
    }
    if (game.status !== enumStatusGameType.Active) {
      return;
    }
    let currentPlayerNumber;
    if (game.player1.userId === userId) {
      currentPlayerNumber = 1;
    } else {
      currentPlayerNumber = 2;
    }
    const answersArray = game.answers;
    const currentPlayerAnswers = answersArray.filter(
      (answer) => answer.playerNumber === currentPlayerNumber,
    );
    const numberOfPlayerAnswers = currentPlayerAnswers.length;

    for (let index = numberOfPlayerAnswers; index < 5; index++) {
      const currentQuestion = game.questions[numberOfPlayerAnswers];
      const answer: QuizAnswers = new QuizAnswers(
        uuidv4(),
        currentPlayerNumber,
        currentQuestion.questionId,
        "Oops, didn't make it in time",
        enumAnswerGameStatus.Incorrect,
        new Date(),
        game,
      );
      game.answers.unshift(answer);
    }

    const player = {
      1: 'player1',
      2: 'player2',
    };

    const playerScores = {
      1: 'player1Score',
      2: 'player2Score',
    };
    const OpposingPlayerNumber = swapPlayerNumber(currentPlayerNumber);

    game.status = enumStatusGameType.Finished;
    game.finishGameDate = new Date();

    if (game[playerScores[OpposingPlayerNumber]] > 0) {
      game[playerScores[OpposingPlayerNumber]]++;
      game[player[OpposingPlayerNumber]].PlayerStatistic.sumScore++;
    }
    if (
      game[playerScores[currentPlayerNumber]] ===
      game[playerScores[OpposingPlayerNumber]]
    ) {
      game.player1.PlayerStatistic.drawsCount++;
      game.player2.PlayerStatistic.drawsCount++;
    }
    if (
      game[playerScores[currentPlayerNumber]] >
      game[playerScores[OpposingPlayerNumber]]
    ) {
      game[player[currentPlayerNumber]].PlayerStatistic.winsCount++;
      game[player[OpposingPlayerNumber]].PlayerStatistic.lossesCount++;
    }
    if (
      game[playerScores[currentPlayerNumber]] <
      game[playerScores[OpposingPlayerNumber]]
    ) {
      game[player[currentPlayerNumber]].PlayerStatistic.lossesCount++;
      game[player[OpposingPlayerNumber]].PlayerStatistic.winsCount++;
    }
    game.player1.PlayerStatistic.gamesCount++;
    game.player2.PlayerStatistic.gamesCount++;

    const result = await this.saveGameChange(game);
    return result;
  }
}
