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
import { QuizAnwswerDbType } from '../quiz.answers.types';

export class PlayerAnswersQuestionGameCommand {
  constructor(
    public userId: string,
    public answerBody: string) {}
}
//TODO затычка, просто создает ответ и отправляет его в игру
@CommandHandler(PlayerAnswersQuestionGameCommand)
export class PlayerAnswersQuestionGameUseCase
  implements ICommandHandler<PlayerAnswersQuestionGameCommand>
{
  constructor(
    private readonly quizGamesRepository: QuizGamesRepository,
  ) {}

  async execute(command: PlayerAnswersQuestionGameCommand): Promise<any> {

    

    let game = await this.quizGamesRepository.getActiveGameByUserId(
      command.userId,
    );

    let gameIndicator
    let playerNumber

    if(game.player1.userId === command.userId){
      gameIndicator = game.gameIndicatorPlayer1
      playerNumber = 1
    } else {
      gameIndicator = game.gameIndicatorPlayer2
      playerNumber = 1
    }

    const answer = new QuizAnwswerDbType(
      uuidv4(),
      gameIndicator,
      uuidv4(),
      command.answerBody,
      'wrong',
      new Date()
    )

    


    return answer;
  }
}
