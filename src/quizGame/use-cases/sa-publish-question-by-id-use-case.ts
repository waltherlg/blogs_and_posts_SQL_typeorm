import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../questions.repository';
import { ActionResult } from '../../helpers/enum.action.result.helper';
import { CheckService } from '../../other.services/check.service';
import { UpdateQuestionImputModelType } from '../quiz.game.types';

export class SaPublishQuestionByIdCommand {
  constructor(public questionId: string, public published: boolean) {}
}

@CommandHandler(SaPublishQuestionByIdCommand)
export class SaPublishQuestionByIdUseCase
  implements ICommandHandler<SaPublishQuestionByIdCommand>
{
  constructor(private readonly questionRepository: QuestionsRepository,
              private readonly checkService: CheckService) {}

  async execute(command: SaPublishQuestionByIdCommand): Promise<ActionResult> {
    if(!(await this.checkService.isQuestionExist(command.questionId))){
      return ActionResult.QuestionNotFound
    }
    //TODO add check is change needed
    const result = await this.questionRepository.publishQuestionById(command.questionId, command.published)
    if(result){
      return ActionResult.Success
    } else {
      return ActionResult.NotSaved
    }
  }
}
