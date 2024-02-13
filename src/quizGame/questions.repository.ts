import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  QuestionDbType,
  Questions,
  UpdateQuestionImputModelType,
} from './quiz.questions.types';
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

  async updateQuestionById(
    questionId: string,
    UpdateQuestionDto: UpdateQuestionImputModelType,
  ): Promise<boolean> {
    if (!isValidUUID(questionId)) {
      return false;
    }
    const result = await this.questionsRepository.update(
      { questionId: questionId },
      {
        body: UpdateQuestionDto.body,
        correctAnswers: UpdateQuestionDto.correctAnswers,
        updatedAt: new Date().toISOString(),
      },
    );
    return result.affected > 0;
  }

  async publishQuestionById(
    questionId: string,
    published: boolean,
  ): Promise<boolean> {
    if (!isValidUUID(questionId)) {
      return false;
    }
    const result = await this.questionsRepository.update(
      { questionId: questionId },
      { published: published, updatedAt: new Date().toISOString() },
    );
    return result.affected > 0;
  }

  // async get5QuestionsIdForGame(): Promise<[]>{
  //   const questions = await this.questionsRepository
  //   .createQueryBuilder('question')
  //   .select(['question.questionId'])
  //   .where('question.published = true')
  //   .orderBy('RANDOM()')
  //   .limit(5)
  //   .getMany();
  //   return questionMapper.returnArrayOfQuestionIdForGame(questions)
  // }

  async get1QuestionsForGame(): Promise<QuestionDbType> {
    const question = await this.questionsRepository
      .createQueryBuilder()
      .select()
      .where('published = true')
      .orderBy('RANDOM()')
      .limit(1)
      .getOne();
    return question;
  }

  async get5QuestionsIdForGame(): Promise<Questions[]> {
    const questions = await this.questionsRepository
      .createQueryBuilder()
      .select()
      .where('published = true')
      .orderBy('RANDOM()')
      .limit(5)
      .getMany();
    return questions;
  }
}
