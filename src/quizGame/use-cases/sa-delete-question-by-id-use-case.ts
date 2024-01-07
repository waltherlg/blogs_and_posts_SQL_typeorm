import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../questions.repository';
import { ActionResult } from '../../helpers/enum.action.result.helper';
import { CheckService } from '../../other.services/check.service';

export class SaDeleteQuestionByIdCommand {
  constructor(public questionId) {}
}
@CommandHandler(SaDeleteQuestionByIdCommand)
export class SaDeleteQuestionByIdUseCase
  implements ICommandHandler<SaDeleteQuestionByIdCommand>
{
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly checkService: CheckService,
  ) {}

  async execute(command: SaDeleteQuestionByIdCommand): Promise<ActionResult> {
    if (!(await this.checkService.isQuestionExist(command.questionId))) {
      return ActionResult.QuestionNotFound;
    }
    const result = await this.questionRepository.deleteQuestionById(
      command.questionId,
    );
    if (result) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
