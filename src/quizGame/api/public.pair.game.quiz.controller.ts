import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
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
import { PlayerRequestGameByIdCommand, PlayerRequestGameByIdUseCase } from '../use-cases/player-request-game-by-id-use-case';
import { request } from 'express';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { PlayerRequestAllGamesCommand } from '../use-cases/somebody-request-all-games-use-case';

@Controller('pair-game-quiz')
export class PublicQuizGameController {
  constructor(private readonly commandBus: CommandBus) {}

  @UseGuards(JwtAuthGuard)
  @Post('pairs/connection')
  @HttpCode(200)
  //TODO
  // 1. Я как зарегестрированный пользователь могу соревноваться в квизе попарно
  // (с другим зарегестрированным пользователем)
  // 2. Я нажимают кнопку: соревноваться (join)
  // 3. Если есть игрок в ожидании - создаётся пара: я + этот игрок
  // 4. Если нет, я становлюсь игроком в ожидании и могу стать парой для
  // следующего, кто нажмёт соревноваться
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
  //TODO
  //Эндпоинт GET /pair-game-quiz/pairs/my-current
  // возвращает активную игру текущего пользователя (того, кто делает запрос)
  // в статусе "PendingSecondPlayer" или "Active".
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
  async getAllGame(@Req() request){
    const games = await this.commandBus.execute(new PlayerRequestAllGamesCommand(request.user.userId))
    return games
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/:gameId')
  @HttpCode(200)
  async getGameById(@Req() request, @Param('gameId') gameId) {
    if (!isValidUUID(gameId)) {
      handleActionResult(ActionResult.InvalidIdFormat)
    } 
    const result = await this.commandBus.execute(new PlayerRequestGameByIdCommand(gameId, request.user.userId))
    handleActionResult(result)
    return result
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
}
