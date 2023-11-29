import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionDbType, Questions } from "./quiz.game.types";
import { Repository } from "typeorm";
import { validate as isValidUUID } from 'uuid';


@Injectable()
export class QuestionsQueryRepository {
    constructor (
        @InjectRepository(Questions)
        private readonly questionsQueryRepository: Repository<Questions>
    ) {}

    async getQuestionForSaById(questionId){
        if (!isValidUUID(questionId)) {
            return null;
          }
          const question: QuestionDbType = await this.questionsQueryRepository.findOne({
            where: [{ questionId: questionId }],
          });
          if(!question) return null
          return {
            id: question.questionId,
            body: question.body,
            correctAnswers: question.correctAnswers,
            published: question.published,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
          };
    }
}