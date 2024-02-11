import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
  Questions,
} from '../quiz.questions.types';
import { QuestionsRepository } from '../questions.repository';
import {
  PlayerDtoType,
  QuizGameDbType,
  enumStatusGameType,
} from '../quiz.game.types';
import { v4 as uuidv4 } from 'uuid';
import { ActionResult } from 'src/helpers/enum.action.result.helper';
import { QuizGamesRepository } from '../quiz.game.repository';
import { UsersRepository } from '../../users/users.repository';
import { UserDBType } from '../../users/users.types';
import { Users } from '../../users/user.entity';

export class PlayerConnectGameCommand {
  constructor(public userId: string) {}
}
@CommandHandler(PlayerConnectGameCommand)
export class PlayerConnectGameUseCase
  implements ICommandHandler<PlayerConnectGameCommand>
{
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly quizGamesRepository: QuizGamesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    command: PlayerConnectGameCommand,
  ): Promise<ActionResult | string> {
    const isUserAlreadyHasGame =
      await this.quizGamesRepository.isUserHaveUnfinishedGame(command.userId);
    if (isUserAlreadyHasGame) {
      return ActionResult.UserAlreadyHasUnfinishedGame;
    }

    const existingGame = await this.quizGamesRepository.getPandingGame();

    if (!existingGame) {
      const questions: Array<Questions> =
        await this.questionRepository.get5QuestionsIdForGame();
      if (questions.length < 5) {
        return ActionResult.NotEnoughQuestions;
      }

      const player1: Users = await this.usersRepository.getUserDBTypeById(
        command.userId,
      );

      const quizGameDto = new QuizGameDbType(
        uuidv4(),
        enumStatusGameType.PendingSecondPlayer,
        new Date(),
        null,
        null,
        [],
        player1,
        0,
        null,
        0,
        questions,
      );

      const newGameId = await this.quizGamesRepository.createQuizGame(
        quizGameDto,
      );
      if (newGameId) {
        return newGameId;
      } else {
        return ActionResult.NotCreated;
      }
    }

    const result = await this.quizGamesRepository.addSecondPlayerToGame(
      existingGame.quizGameId,
      command.userId,
    );

    if (result) {
      return existingGame.quizGameId;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
