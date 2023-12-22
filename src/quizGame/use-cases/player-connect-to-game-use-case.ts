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

export class PlayerConnectGameCommand {
  constructor(public userId: string) {}
}
//TODO need finish
@CommandHandler(PlayerConnectGameCommand)
export class PlayerConnectGameUseCase
  implements ICommandHandler<PlayerConnectGameCommand>
{
  constructor(private readonly questionRepository: QuestionsRepository,
              private readonly quizGamesRepository: QuizGamesRepository ) {}

  async execute(command: PlayerConnectGameCommand): Promise<any> {
    const questions: Array<string> = await this.questionRepository.get5QuestionsIdForGame()
    if (questions.length < 5) {
      return ActionResult.NotEnoughQuestions
    }
    const quizGameDto = new QuizGameDbType (
      uuidv4(),
      enumStatusGameType.PendingSecondPlayer,
      new Date(),
      null,
      null,

      // command.userId,
      uuidv4(),
      0,

      // null,
      uuidv4(),
      0,

      questions[0],
      questions[1],
      questions[2],
      questions[3],
      questions[4]
    )
    const newGameId = await this.quizGamesRepository.createQuizGame(quizGameDto)
    if (newGameId){
      return newGameId
    } else {
      return ActionResult.NotCreated
    }

  }
}
