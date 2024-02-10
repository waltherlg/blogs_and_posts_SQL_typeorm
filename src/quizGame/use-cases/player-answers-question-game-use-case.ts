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
    private readonly quizAnswersRepository: QuizAnswersRepository,
    private readonly quizGamesRepository: QuizGamesRepository,
  ) {}

  async execute(command: PlayerAnswersQuestionGameCommand): Promise<any> {

    let game = await this.quizGamesRepository.getActiveGameByUserId(
      command.userId,
    );

    console.log("game in use case ", game);
    

    let playerNumber

    if(game.player1.userId === command.userId){
      playerNumber = 1
    } else {
      playerNumber = 2
    }

    const answer = new QuizAnwswerDbType(
      uuidv4(),
      playerNumber,
      uuidv4(),
      command.answerBody,
      'wrong',
      new Date(),
      game,
    )

    game.answers[0] = answer
    console.log("game after push ", game);

    const result = await this.quizAnswersRepository.saveAnswerInGame(answer)
    
    //const result = await this.quizGamesRepository.saveGameChange(game)
    return result;
  }
}
