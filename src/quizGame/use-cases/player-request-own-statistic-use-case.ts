import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ActionResult } from 'src/helpers/enum.action.result.helper';
import { QuizGamesRepository } from '../quiz.game.repository';

export class PlayerRequestOwnStatisticCommand {
  constructor(public userId: string) {}
}
@CommandHandler(PlayerRequestOwnStatisticCommand)
export class PlayerRequestOwnStatisticUseCase
  implements ICommandHandler<PlayerRequestOwnStatisticCommand>
{
  constructor(private readonly quizGamesRepository: QuizGamesRepository) {}

  async execute(command: PlayerRequestOwnStatisticCommand): Promise<any> {
    const result = await this.quizGamesRepository.GetCurrentUserStatistic(
      command.userId,
    );
    if (!result) {
      return ActionResult.GameNotFound;
    }
    return result;
  }
}
