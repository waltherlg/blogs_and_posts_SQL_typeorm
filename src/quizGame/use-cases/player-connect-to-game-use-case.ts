import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
} from '../questions.quiz.types';
import { QuestionsRepository } from '../questions.repository';
import { QuizGameDbType, enumStatusGameType } from '../quiz.game.types';
import { v4 as uuidv4 } from 'uuid';
import { ActionResult } from 'src/helpers/enum.action.result.helper';

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
    const questions = await this.questionRepository.get5QuestionsIdForGame()
    if (questions.length < 5) {
      return ActionResult.NotEnoughQuestions
    }
    const quizGameDto = new QuizGameDbType (
      uuidv4(),
      enumStatusGameType.PendingSecondPlayer,
      new Date(),
      null,
      null,
      questions,
      command.userId,
      [],
      0,
      null,
      [],
      0,
    )

  }
}