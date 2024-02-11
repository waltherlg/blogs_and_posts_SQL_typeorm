import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
} from '../quiz.questions.types';
import { QuestionsRepository } from '../questions.repository';
import {
  QuizGameDbType,
  QuizGames,
  enumStatusGameType,
} from '../quiz.game.types';
import { v4 as uuidv4 } from 'uuid';
import { ActionResult } from 'src/helpers/enum.action.result.helper';
import { QuizGamesRepository } from '../quiz.game.repository';
import {
  QuizAnswers,
  QuizAnwswerDbType,
  enumAnswerGameStatus,
} from '../quiz.answers.types';
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
    const game: QuizGames =
      await this.quizGamesRepository.getActiveGameByUserId(command.userId);

    let currentPlayerNumber;
    if (game.player1.userId === command.userId) {
      currentPlayerNumber = 1;
    } else {
      currentPlayerNumber = 2;
    }

    const answersArray = game.answers;
    const currentPlayerAnswers = answersArray.filter(
      (answer) => answer.playerNumber === currentPlayerNumber,
    );
    const numberOfPlayerAnswers = currentPlayerAnswers.length;
    if (numberOfPlayerAnswers >= 5) {
      return ActionResult.PlayerAnsweredAllQuestions;
    }

    //console.log("curentPlayerAnswersArray ", currentPlayerAnswers, "numberOfPlayerAnswers ", numberOfPlayerAnswers);

    const currentQuestion = game.questions[numberOfPlayerAnswers];
    //console.log("currentQuestion ", currentQuestion);

    let answerStatus;
    const correctAnswersArray = currentQuestion.correctAnswers;
    if (correctAnswersArray.includes(command.answerBody)) {
      answerStatus = enumAnswerGameStatus.Correct;
    } else {
      answerStatus = enumAnswerGameStatus.Incorrect;
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

    // if (answerStatus === enumAnswerGameStatus.Correct) {
    //   if (currentPlayerNumber === 1) {
    //     game.player1Score++;
    //   } else {
    //     game.player2Score++;
    //   }
    // }

    const playerScores = {
      1: 'player1Score',
      2: 'player2Score',
    };

    if (answerStatus === enumAnswerGameStatus.Correct) {
      game[playerScores[currentPlayerNumber]]++;
    }

    //TODO: need finish
    if (numberOfPlayerAnswers === 4) {
      if (game[playerScores[currentPlayerNumber]] > 0) {
        const numberOfOpposingPlayersAnswer = answersArray.filter(
          (answer) => answer.playerNumber !== currentPlayerNumber,
        ).length;
        console.log(
          'numberOfOpposingPlayersAnswer ',
          numberOfOpposingPlayersAnswer,
        );
        if (numberOfOpposingPlayersAnswer < 5) {
          game[playerScores[currentPlayerNumber]]++;
        } else {
          game.status = enumStatusGameType.Finished;
          game.finishGameDate = new Date();
        }
      }
    }

    //console.log("количество ответов ", numberOfPlayerAnswers, " ответ ", answer);

    // const result = await this.quizAnswersRepository.saveAnswerInGame(answer);
    // if(result){
    //   return ActionResult.Success
    // } else {
    //   return ActionResult.NotSaved
    // }

    //console.log("game before answer push ", game);

    game.answers.push(answer);
    //console.log("game after answer push ", game);

    const result = await this.quizGamesRepository.saveGameChange(game);
    if (result) {
      return answer.returnForPlayer();
    } else {
      return ActionResult.NotSaved;
    }
  }
}
