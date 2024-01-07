import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { QuestionsRepository } from '../questions.repository';
import { ActionResult } from '../../helpers/enum.action.result.helper';
import { CheckService } from '../../other.services/check.service';
import { UpdateQuestionImputModelType } from '../quiz.questions.types';

export class SaUpdateQuestionByIdCommand {
  constructor(
    public questionId,
    public updateQuestionDto: UpdateQuestionImputModelType,
  ) {}
}

@CommandHandler(SaUpdateQuestionByIdCommand)
export class SaUpdateQuestionByIdUseCase
  implements ICommandHandler<SaUpdateQuestionByIdCommand>
{
  constructor(
    private readonly questionRepository: QuestionsRepository,
    private readonly checkService: CheckService,
  ) {}

  async execute(command: SaUpdateQuestionByIdCommand): Promise<ActionResult> {
    if (!(await this.checkService.isQuestionExist(command.questionId))) {
      return ActionResult.QuestionNotFound;
    }
    const result = await this.questionRepository.updateQuestionById(
      command.questionId,
      command.updateQuestionDto,
    );
    if (result) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
