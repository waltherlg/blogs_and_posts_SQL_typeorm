import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  Put,
  Query,
  UseGuards,
  Param,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import {
  CreateQuestionImputModelType,
  PublishQuestionImputModelType,
  UpdateQuestionImputModelType,
} from '../quiz.questions.types';
import { BasicAuthGuard } from 'src/auth/guards/auth.guards';
import { SaCreateQuestionCommand } from '../use-cases/sa-creates-question-use-case';
import { QuestionsRepository } from '../questions.repository';
import { QuestionsQueryRepository } from '../questions.query.repository';
import {
  DEFAULT_QUESTIONS_QUERY_PARAMS,
  RequestQuestionsQueryModel,
} from 'src/models/types';
import { CheckService } from '../../other.services/check.service';
import { CustomNotFoundException } from '../../exceptions/custom.exceptions';
import {
  ActionResult,
  handleActionResult,
} from '../../helpers/enum.action.result.helper';
import { SaDeleteQuestionByIdCommand } from '../use-cases/sa-delete-question-by-id-use-case';
import { validate as isValidUUID } from 'uuid';
import { SaUpdateQuestionByIdCommand } from '../use-cases/sa-update-question-by-id-use-case';
import { SaPublishQuestionByIdCommand } from '../use-cases/sa-publish-question-by-id-use-case';

@UseGuards(BasicAuthGuard)
@Controller('quiz')
export class SaQuizController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly questionQueryRepository: QuestionsQueryRepository,
    private readonly checkService: CheckService,
  ) {}

  @Get('questions')
  @HttpCode(200)
  async getAllQuestions(@Query() queryParams: RequestQuestionsQueryModel) {
    const mergedQueryParams = {
      ...DEFAULT_QUESTIONS_QUERY_PARAMS,
      ...queryParams,
    };
    return await this.questionQueryRepository.getAllQuestionsForSa(
      mergedQueryParams,
    );
  }

  @Post('questions')
  @HttpCode(201)
  async createQuestion(
    @Body() inputQuestionData: CreateQuestionImputModelType,
  ) {
    const newQuestionId = await this.commandBus.execute(
      new SaCreateQuestionCommand(inputQuestionData),
    );
    const createdQuestion =
      await this.questionQueryRepository.getQuestionForSaById(newQuestionId);
    return createdQuestion;
  }

  @Delete('questions/:questionId')
  @HttpCode(204)
  async deleteQuestionById(@Param('questionId') questionId: string) {
    const deleteResult: ActionResult = await this.commandBus.execute(
      new SaDeleteQuestionByIdCommand(questionId),
    );
    handleActionResult(deleteResult);
  }

  @Put('questions/:questionId')
  @HttpCode(204)
  async updateQuestionById(
    @Param('questionId') questionId: string,
    @Body() updateQuestionDto: UpdateQuestionImputModelType,
  ) {
    const updateResult: ActionResult = await this.commandBus.execute(
      new SaUpdateQuestionByIdCommand(questionId, updateQuestionDto),
    );
    handleActionResult(updateResult);
  }

  @Put('questions/:questionId/publish')
  @HttpCode(204)
  //TODO
  async publishQuestionById(
    @Param('questionId') questionId: string,
    @Body() publish: PublishQuestionImputModelType,
  ) {
    const publishResult: ActionResult = await this.commandBus.execute(
      new SaPublishQuestionByIdCommand(questionId, publish.published),
    );
    handleActionResult(publishResult);
  }
}
