import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
} from '../quiz.questions.types';
import { QuestionsRepository } from '../questions.repository';
import { QuizGameDbType, enumStatusGameType } from '../quiz.game.types';
import { v4 as uuidv4 } from 'uuid';
import { ActionResult } from 'src/helpers/enum.action.result.helper';
import { QuizGamesRepository } from '../quiz.game.repository';

export class PlayerRequestActiveGameCommand {
  constructor(public userId: string) {}
}
//TODO need finish
@CommandHandler(PlayerRequestActiveGameCommand)
export class PlayerRequestActiveGameUseCase
  implements ICommandHandler<PlayerRequestActiveGameCommand>
{
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly quizGamesRepository: QuizGamesRepository,
  ) {}

  async execute(command: PlayerRequestActiveGameCommand): Promise<any> {
    const game = await this.quizGamesRepository.getActiveGameByUserId(
      command.userId,
    );
    return game;
  }
}
