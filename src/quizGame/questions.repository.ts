import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionDbType, Questions } from "./quiz.game.types";
import { Repository } from "typeorm";
import { validate as isValidUUID } from 'uuid';


@Injectable()
export class QuestionsRepository {
    constructor (
        @InjectRepository(Questions)
        private readonly questionsRepository: Repository<Questions>
    ) {}

    async createQuestion(questionDto: QuestionDbType): Promise<string>{
        const result = await this.questionsRepository.save(questionDto)
        return result.questionId;
    }

    async getQuestionDbTypeById(questionId){
        if (!isValidUUID(questionId)) {
            return null;
          }
          const result = await this.questionsRepository.findOne({
            where: [{ questionId: questionId }],
          });
          return result;
    }

    async deleteQuestionById(questionId): Promise<boolean>{
        if (!isValidUUID(questionId)) {
            return false;
          }
        const result = await this.questionsRepository.delete(questionId)
        return result.affected > 0
    }
}