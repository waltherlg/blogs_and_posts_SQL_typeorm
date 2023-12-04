import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionDbType,
  Questions,
  questionOutputSaType,
} from './quiz.game.types';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { questionMapper } from './helpers/questions.mapper';
import { PaginationOutputModel } from 'src/models/types';
import {
  publishedStatusFixer,
  sortDirectionFixer,
} from 'src/helpers/helpers.functions';

@Injectable()
export class QuestionsQueryRepository {
  constructor(
    @InjectRepository(Questions)
    private readonly questionsQueryRepository: Repository<Questions>,
  ) {}

  async getQuestionForSaById(questionId): Promise<questionOutputSaType> {
    if (!isValidUUID(questionId)) {
      return null;
    }
    const question: QuestionDbType =
      await this.questionsQueryRepository.findOne({
        where: [{ questionId: questionId }],
      });
    if (!question) return null;
    return questionMapper.forSa(question);
  }

  async getAllQuestionsForSa(
    mergedQueryParams,
  ): Promise<PaginationOutputModel<questionOutputSaType>> {
    const bodySearchTerm = mergedQueryParams.bodySearchTerm;
    const publishedStatus = publishedStatusFixer(
      mergedQueryParams.publishedStatus,
    );
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder =
      this.questionsQueryRepository.createQueryBuilder('question');
    queryBuilder.select().where('1=1');
    if (bodySearchTerm !== '') {
      queryBuilder.andWhere(`question.body ILIKE :bodySearchTerm`, {
        bodySearchTerm: `%${bodySearchTerm}`,
      });
    }
    if (publishedStatus !== 'all') {
      queryBuilder.andWhere(`question.body = :publishedStatus`, {
        publishedStatus: `%${publishedStatus}`,
      });
    }

    const [questions, questionsCount] = await queryBuilder
      .orderBy(`question.${sortBy}`, sortDirection)
      .skip(skipPage)
      .take(pageSize)
      .getManyAndCount();

    const outQuestions = questions.map((question) =>
      questionMapper.forSa(question),
    );

    const pageCount = Math.ceil(questionsCount / pageSize);

    const outputQuestions: PaginationOutputModel<questionOutputSaType> = {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: questionsCount,
      items: outQuestions,
    };
    return outputQuestions;
  }
}
