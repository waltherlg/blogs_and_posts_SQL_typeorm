import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
} from '../questions.quiz.types';
import { v4 as uuidv4 } from 'uuid';
import { QuestionsRepository } from '../questions.repository';

export class PlayerConnectGameCommand {
  constructor(public userId: string) {}
}
//TODO need finish
@CommandHandler(PlayerConnectGameCommand)
export class PlayerConnectGameUseCase
  implements ICommandHandler<PlayerConnectGameCommand>
{
  constructor(private readonly questionRepository: QuestionsRepository) {}

  async execute(command: PlayerConnectGameCommand): Promise<any> {

  }
}
