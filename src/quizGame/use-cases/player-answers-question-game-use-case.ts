import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
} from '../quiz.questions.types';
import { QuestionsRepository } from '../questions.repository';
import { QuizGameDbType, QuizGames, enumStatusGameType } from '../quiz.game.types';
import { v4 as uuidv4 } from 'uuid';
import { ActionResult } from 'src/helpers/enum.action.result.helper';
import { QuizGamesRepository } from '../quiz.game.repository';
import { QuizAnswers, QuizAnwswerDbType, enumAnswerGameStatus } from '../quiz.answers.types';
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
    const game: QuizGames = await this.quizGamesRepository.getActiveGameByUserId(
      command.userId,
    );    

    let currentPlayerNumber;
    if (game.player1.userId === command.userId) {
      currentPlayerNumber = 1;
    } else {
      currentPlayerNumber = 2;
    }

    const answersArray = game.answers
    const currentPlayerAnswers = answersArray.filter((answer) => answer.playerNumber === currentPlayerNumber)
    const numberOfPlayerAnswers = currentPlayerAnswers.length
    if(numberOfPlayerAnswers >= 5){
      return ActionResult.PlayerAnsweredAllQuestions
    }

    //console.log("curentPlayerAnswersArray ", currentPlayerAnswers, "numberOfPlayerAnswers ", numberOfPlayerAnswers);
    
    const currentQuestion = game.questions[numberOfPlayerAnswers]
    //console.log("currentQuestion ", currentQuestion);

    let answerStatus
    const correctAnswersArray = currentQuestion.correctAnswers
    if(correctAnswersArray.includes(command.answerBody)){
      answerStatus = enumAnswerGameStatus.Correct
    } else {
      answerStatus = enumAnswerGameStatus.Incorrect
    }
    
    const answer: QuizAnswers = new QuizAnwswerDbType(
      uuidv4(),
      currentPlayerNumber,
      currentQuestion.questionId,
      command.answerBody,
      answerStatus,
      new Date(),
      game,
    );

    //console.log("количество ответов ", numberOfPlayerAnswers, " ответ ", answer);
    
    // const result = await this.quizAnswersRepository.saveAnswerInGame(answer);
    // if(result){
    //   return ActionResult.Success
    // } else {
    //   return ActionResult.NotSaved
    // }

    game.answers.push(answer)
    console.log("game after answer push ", game);
    

    const result = await this.quizGamesRepository.saveGameChange(game)
    if(result){
      return ActionResult.Success
    } else {
      return ActionResult.NotSaved
    }
  }
}
