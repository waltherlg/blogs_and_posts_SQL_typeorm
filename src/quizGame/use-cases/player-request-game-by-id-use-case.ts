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

export class PlayerRequestGameByIdCommand {
  constructor(public gameId: string, public userId: string) {}
}
//TODO need finish
@CommandHandler(PlayerRequestGameByIdCommand)
export class PlayerRequestGameByIdUseCase
  implements ICommandHandler<PlayerRequestGameByIdCommand>
{
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly quizGamesRepository: QuizGamesRepository,
  ) {}

  async execute(command: PlayerRequestGameByIdCommand): Promise<any> {
    const game = await this.quizGamesRepository.getGameByIdAnyStatus(
      command.gameId
    );
    if(!game){
      return ActionResult.GameNotFound
    }
    if (game.player1.userId != command.userId && game.player2.userId != command.userId){
      return ActionResult.NotOwner
    }
    return game.returnForPlayer()
  }
}
