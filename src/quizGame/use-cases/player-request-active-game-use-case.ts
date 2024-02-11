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

export class PlayerRequestActiveGameCommand {
  constructor(public userId: string) {}
}
//TODO need finish
@CommandHandler(PlayerRequestActiveGameCommand)
export class PlayerRequestActiveGameUseCase
  implements ICommandHandler<PlayerRequestActiveGameCommand>
{
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly quizGamesRepository: QuizGamesRepository,
  ) {}

  async execute(command: PlayerRequestActiveGameCommand): Promise<any> {
    const game = await this.quizGamesRepository.getActiveGameByUserId(
      command.userId,
    );
    console.log("игра в юзкейсе запроса активной игры ", game);
    console.log("ответы в вопросах в игре ", game.questions[0].correctAnswers)
    if(!game){
      return ActionResult.GameNotFound
    }
    
    //TODO: remove this blog before prod
    let playerNumber;
    if (game.player1.userId === command.userId) {
      playerNumber = 1;
    } else {
      playerNumber = 2;
    }
    const answersArray = game.answers
    const curentPlayerAnswers = answersArray.filter((answer) => answer.playerNumber = playerNumber)
    const numberOfPlayerAnswers = curentPlayerAnswers.length
    return game;
  }
}
