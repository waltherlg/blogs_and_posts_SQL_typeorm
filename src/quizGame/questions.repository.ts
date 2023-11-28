import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { QuestionDbType, Questions } from "./quiz.game.types";
import { Repository } from "typeorm";


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
}