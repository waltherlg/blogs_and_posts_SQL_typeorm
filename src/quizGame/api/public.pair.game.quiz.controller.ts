import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PlayerConnectGameCommand } from '../use-cases/player-connect-to-game-use-case';
import {
  ActionResult,
  handleActionResult,
} from 'src/helpers/enum.action.result.helper';
import { validate as isValidUUID } from 'uuid';
import { PlayerRequestActiveGameCommand } from '../use-cases/player-request-active-game-use-case';
import { AnswerInputModelType } from '../quiz.answers.types';
import { PlayerAnswersQuestionGameCommand } from '../use-cases/player-answers-question-game-use-case';
import {
  PlayerRequestGameByIdCommand,
  PlayerRequestGameByIdUseCase,
} from '../use-cases/player-request-game-by-id-use-case';
import { request } from 'express';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { PlayerRequestAllGamesCommand } from '../use-cases/somebody-request-all-games-use-case';
import { PlayerRequestOwnStatisticCommand } from '../use-cases/player-request-own-statistic-use-case';
import { DEFAULT_GAMES_QUERY_PARAMS, DEFAULT_QUERY_PARAMS, RequestQueryParamsModel } from 'src/models/types';
import { QuizGamesRepository } from '../quiz.game.repository';

@Controller('pair-game-quiz')
export class PublicQuizGameController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly quizGamesRepository: QuizGamesRepository) {}

  @UseGuards(JwtAuthGuard)
  @Post('pairs/connection')
  @HttpCode(200)
  async ConnectOrCreateGame(@Req() request) {
    //TODO: разобраться с типизацией, почему результат не может быть стринг
    const result = await this.commandBus.execute(
      new PlayerConnectGameCommand(request.user.userId),
    ); // result will be actionResult or gameId
    handleActionResult(result);
    const connectedGame = await this.commandBus.execute(
      new PlayerRequestActiveGameCommand(request.user.userId),
    );
    handleActionResult(connectedGame);
    return connectedGame;
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/my-current')
  @HttpCode(200)
  async ReturnActiveGame(@Req() request) {
    const result = await this.commandBus.execute(
      new PlayerRequestActiveGameCommand(request.user.userId),
    );
    handleActionResult(result);
    return result;
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get('pairs')
  @HttpCode(200)
  async getAllGame(@Req() request) {
    const games = await this.commandBus.execute(
      new PlayerRequestAllGamesCommand(request.user.userId),
    );
    return games;
  }

  @UseGuards(JwtAuthGuard)
  @Post('pairs/my-current/answers')
  @HttpCode(200)
  async putAnswers(@Req() request, @Body() answerBody: AnswerInputModelType) {
    const result = await this.commandBus.execute(
      new PlayerAnswersQuestionGameCommand(
        request.user.userId,
        answerBody.answer,
      ),
    );
    handleActionResult(result);
    return result;
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/my')
  @HttpCode(200)
  async returnAllGamesForCurrentUser(
    @Query() queryParams: RequestQueryParamsModel,
    @Req() request){
      const mergedQueryParams = { ...DEFAULT_GAMES_QUERY_PARAMS, ...queryParams };
      const games = await this.quizGamesRepository.getAllGamesForCurrentUser(mergedQueryParams, request.user.userId)
      return games


    // query params
    // sortBy Default value : pairCreatedDate
    // sortDirectionDefault value: desc Available values : asc, desc
    // pageNumberDefault value : 1
    // pageSizeDefault value : 10

    // example output
    // {
    //   "pagesCount": 0,
    //   "page": 0,
    //   "pageSize": 0,
    //   "totalCount": 0,
    //   "items": [
    //     {
    //       "id": "string",
    //       "firstPlayerProgress": {
    //         "answers": [
    //           {
    //             "questionId": "string",
    //             "answerStatus": "Correct",
    //             "addedAt": "2024-03-19T04:24:08.757Z"
    //           }
    //         ],
    //         "player": {
    //           "id": "string",
    //           "login": "string"
    //         },
    //         "score": 0
    //       },
    //       "secondPlayerProgress": {
    //         "answers": [
    //           {
    //             "questionId": "string",
    //             "answerStatus": "Correct",
    //             "addedAt": "2024-03-19T04:24:08.757Z"
    //           }
    //         ],
    //         "player": {
    //           "id": "string",
    //           "login": "string"
    //         },
    //         "score": 0
    //       },
    //       "questions": [
    //         {
    //           "id": "string",
    //           "body": "string"
    //         }
    //       ],
    //       "status": "PendingSecondPlayer",
    //       "pairCreatedDate": "2024-03-19T04:24:08.758Z",
    //       "startGameDate": "2024-03-19T04:24:08.758Z",
    //       "finishGameDate": "2024-03-19T04:24:08.758Z"
    //     }
    //   ]
    // }
  }

// TODO
@UseGuards(JwtAuthGuard)
@Get('users/my-statistic')
@HttpCode(200)
async returnCurrentUsetStatistic(@Req() request){
  const result = await this.commandBus.execute(new PlayerRequestOwnStatisticCommand(request.user.userId))
  handleActionResult(result)
  return result
  //const result = await this.
  //example
  // {
  //   "sumScore": 0,
  //   "avgScores": 0,
  //   "gamesCount": 0,
  //   "winsCount": 0,
  //   "lossesCount": 0,
  //   "drawsCount": 0
  // }
}

  //TODO: WTF?!? от смены порядка эндпоинтов путается постмен 
  // (если поменять местами этот эндпоинт с предыдущими, 
  // то например в 'pairs/my' my будет восприниматья как ури параметр )
@UseGuards(JwtAuthGuard)
@Get('pairs/:gameId')
@HttpCode(200)
async getGameById(@Req() request, @Param('gameId') gameId) {
  if (!isValidUUID(gameId)) {
    handleActionResult(ActionResult.InvalidIdFormat);
  }
  const result = await this.commandBus.execute(
    new PlayerRequestGameByIdCommand(gameId, request.user.userId),
  );
  handleActionResult(result);
  return result;
}

}
