import { Controller, Get, HttpCode, Post, Req, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PlayerConnectGameCommand } from '../use-cases/player-connect-to-game-use-case';
import { ActionResult, handleActionResult } from 'src/helpers/enum.action.result.helper';
import { PlayerRequestActiveGameCommand } from '../use-cases/player-request-active-game-use-case';

@Controller('pair-game-quiz')
export class PublicQuizGameController {
  constructor (
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Post('pairs/my-current')
  @HttpCode(200)
  //TODO
  // 1. Я как зарегестрированный пользователь могу соревноваться в квизе попарно
  // (с другим зарегестрированным пользователем)
  // 2. Я нажимают кнопку: соревноваться (join)
  // 3. Если есть игрок в ожидании - создаётся пара: я + этот игрок
  // 4. Если нет, я становлюсь игроком в ожидании и могу стать парой для
  // следующего, кто нажмёт соревноваться
  async ConnectOrCreateGame(
    @Req() request
  ) {
    const result = await this.commandBus.execute( new PlayerConnectGameCommand(request.user.userId))
    handleActionResult(result)
    return 'game'
  }

  @UseGuards(JwtAuthGuard)
  @Get('pairs/my-current')
  @HttpCode(200)
  //TODO
  //Эндпоинт GET /pair-game-quiz/pairs/my-current
  // возвращает активную игру текущего пользователя (того, кто делает запрос)
  // в статусе "PendingSecondPlayer" или "Active".
  async ReturnActiveGame(@Req() request) {
    const result = await this.commandBus.execute( new PlayerRequestActiveGameCommand(request.user.userId))
    handleActionResult(result)
    return result
  }

  @Get('pairs/:gameId')
  @HttpCode(200)
  //TODO
  // Эндпоинт GET /pair-game-quiz/pairs/:id возвращает игру
  // текущего пользователя (того, кто делает запрос)  в любом статусе.
  // Если игра в статусе ожидания второго игрока (status: "PendingSecondPlayer")
  // - поля secondPlayerProgress: null, questions: null, startGameDate: null,
  // finishGameDate: null
  async getGameById(@Req() request) {
    
  }

  @UseGuards(JwtAuthGuard)
  @Post('pairs/my-current/answers')
  @HttpCode(200)
  //TODO
  // 6. Когда фиксируется пара, система рандомно выбирает из списка 5 вопросов
  // и фиксирует их для пары  (одни и теже 5 вопросов для каждого игрока в паре).
  // Если пары еще нет ( поле status: "PendingSecondPlayer") -
  // список вопросов не возвращаем (поле questions: null).
  // Если к игре подлючился второй игрок (status: "Active") - возвращаем все 5 вопросов
  // (поле questions: [...])
  // Участники последовательно отвечают на вопросы. Одна попытка.
  // Ответ либо правильный либо нет.
  async putAnswers() {}
}
