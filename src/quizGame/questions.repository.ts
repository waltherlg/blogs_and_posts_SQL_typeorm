import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QuestionDbType, Questions, UpdateQuestionImputModelType } from './questions.quiz.types';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class QuestionsRepository {
  constructor(
    @InjectRepository(Questions)
    private readonly questionsRepository: Repository<Questions>,
  ) {}

  async createQuestion(questionDto: QuestionDbType): Promise<string> {
    const result = await this.questionsRepository.save(questionDto);
    return result.questionId;
  }

  async getQuestionDbTypeById(questionId) {
    if (!isValidUUID(questionId)) {
      return null;
    }
    const result = await this.questionsRepository.findOne({
      where: [{ questionId: questionId }],
    });
    return result;
  }

  async deleteQuestionById(questionId): Promise<boolean> {
    if (!isValidUUID(questionId)) {
      return false;
    }
    const result = await this.questionsRepository.delete(questionId);
    return result.affected > 0;
  }

  async isQuestionExist(questionId): Promise<boolean> {
    if (!isValidUUID(questionId)) {
      return false;
    }
    const count = await this.questionsRepository.count({
      where: { questionId },
    });
    return count > 0;
  }

  async updateQuestionById(questionId: string, UpdateQuestionDto: UpdateQuestionImputModelType): Promise<boolean>{
    if (!isValidUUID(questionId)) {
      return false;
    }
    const result = await this.questionsRepository.update(
      {questionId: questionId},
      {
        body: UpdateQuestionDto.body,
        correctAnswers: UpdateQuestionDto.correctAnswers,
        updatedAt: new Date().toISOString()
      }
    )
    return result.affected > 0;
  }

  async publishQuestionById(questionId: string, published: boolean): Promise<boolean>{
    if (!isValidUUID(questionId)) {
      return false;
    }
    const result = await this.questionsRepository.update(
      { questionId: questionId },
      { published: published }
    )
    return result.affected > 0;
  }

  async get5QuestionsForGame(){
    const questions = await this.questionsRepository
    .createQueryBuilder()
    .select()
    .orderBy('RANDOM()')
    .limit(5)
    .getMany();
    return questions
  }
  
}
