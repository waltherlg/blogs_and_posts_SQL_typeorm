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
import { QuizAnswers, QuizAnwswerDbType } from '../quiz.answers.types';
import { QuizAnswersRepository } from '../quiz.answers.repository';

export class PlayerAnswersQuestionGameCommand {
  constructor(public userId: string, public answerBody: string) {}
}
//TODO затычка, просто создает ответ и отправляет его в игру
@CommandHandler(PlayerAnswersQuestionGameCommand)
export class PlayerAnswersQuestionGameUseCase
  implements ICommandHandler<PlayerAnswersQuestionGameCommand>
{
  constructor(
    private readonly quizAnswersRepository: QuizAnswersRepository,
    private readonly quizGamesRepository: QuizGamesRepository,
  ) {}

  async execute(command: PlayerAnswersQuestionGameCommand): Promise<any> {
    const game = await this.quizGamesRepository.getActiveGameByUserId(
      command.userId,
    );

    console.log(
      "входящий айди юзера ", command.userId, 
      " юзер айди игрока 1 ", game.player1.userId,
      " юзер айди игрока 2 ", game.player2.userId);
    

    let currentPlayerNumber;
    if (game.player1.userId === command.userId) {
      currentPlayerNumber = 1;
    } else {
      currentPlayerNumber = 2;
    }

    const answersArray = game.answers
    const curкentPlayerAnswers = answersArray.filter((answer) => answer.playerNumber === currentPlayerNumber)
    const numberOfPlayerAnswers = curкentPlayerAnswers.length
    console.log("curentPlayerAnswersArray ", curкentPlayerAnswers, "numberOfPlayerAnswers ", numberOfPlayerAnswers);
    
    const currentQuestion = game
    

    const answer = new QuizAnwswerDbType(
      uuidv4(),
      currentPlayerNumber,
      uuidv4(),
      command.answerBody,
      'wrong',
      new Date(),
      game,
    );

    const result = await this.quizAnswersRepository.saveAnswerInGame(answer);

    return result;
  }
}
