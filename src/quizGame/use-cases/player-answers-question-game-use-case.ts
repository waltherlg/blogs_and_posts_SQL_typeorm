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
import { swapPlayerNumber } from '../../helpers/helpers.functions';

export class PlayerAnswersQuestionGameCommand {
  constructor(public userId: string, public answerBody: string) {}
}
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
    if (!game) {
      return ActionResult.NotOwner;
    }
    if (game.status !== enumStatusGameType.Active) {
      return ActionResult.GameHasntStartedYet;
    }
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

    const currentQuestion = game.questions[numberOfPlayerAnswers];

    let answerStatus;
    const correctAnswersArray = currentQuestion.correctAnswers;
    if (correctAnswersArray.includes(command.answerBody)) {
      answerStatus = enumAnswerGameStatus.Correct;
    } else {
      answerStatus = enumAnswerGameStatus.Incorrect;
    }

    //TODO: спросить как можно избежать дублирования метода

    const answer: QuizAnswers = new QuizAnswers(
      uuidv4(),
      currentPlayerNumber,
      currentQuestion.questionId,
      command.answerBody,
      answerStatus,
      new Date(),
      game,
    );

    const playerScores = {
      1: 'player1Score',
      2: 'player2Score',
    };

    if (answerStatus === enumAnswerGameStatus.Correct) {
      game[playerScores[currentPlayerNumber]]++;
    }

    if (numberOfPlayerAnswers === 4) {
      const numberOfOpposingPlayersAnswer = answersArray.filter(
        (answer) => answer.playerNumber !== currentPlayerNumber,
      ).length;

      if (numberOfOpposingPlayersAnswer === 5) {
        game.status = enumStatusGameType.Finished;
        game.finishGameDate = new Date();
        const OpposingPlayerNumber = swapPlayerNumber(currentPlayerNumber);
        if (game[playerScores[OpposingPlayerNumber]] > 0) {
          game[playerScores[OpposingPlayerNumber]]++;
        }
      }
    }
    game.answers.unshift(answer);

    const result = await this.quizGamesRepository.saveGameChange(game);
    if (result) {
      return answer.returnForPlayer();
    } else {
      return ActionResult.NotSaved;
    }
  }
}
