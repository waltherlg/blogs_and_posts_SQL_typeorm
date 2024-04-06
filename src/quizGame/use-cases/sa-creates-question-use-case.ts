import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  QuestionDbType,
} from '../quiz.questions.types';
import { v4 as uuidv4 } from 'uuid';
import { QuestionsRepository } from '../questions.repository';

export class SaCreateQuestionCommand {
  constructor(public questionCreateInputDto: CreateQuestionImputModelType) {}
}
@CommandHandler(SaCreateQuestionCommand)
export class SaCreateQuestionUseCase
  implements ICommandHandler<SaCreateQuestionCommand>
{
  constructor(private readonly questionRepository: QuestionsRepository) {}

  async execute(command: SaCreateQuestionCommand): Promise<any> {
    const questionDto = new QuestionDbType(
      uuidv4(),
      command.questionCreateInputDto.body,
      command.questionCreateInputDto.correctAnswers,
      false,
      new Date().toISOString(),
      null,
    );
    const questionId = await this.questionRepository.createQuestion(
      questionDto,
    );
    return questionId;
  }
}
