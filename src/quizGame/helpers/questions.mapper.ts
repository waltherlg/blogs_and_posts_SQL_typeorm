import { QuestionDbType } from '../questions.quiz.types';

export const questionMapper = {
  returnForSa(question: QuestionDbType) {
    return {
      id: question.questionId,
      body: question.body,
      correctAnswers: question.correctAnswers,
      published: question.published,
      createdAt: question.createdAt,
      updatedAt: question.updatedAt,
    };
  },

  returnForQuizGame(question: QuestionDbType){
    return {
      id: question.questionId,
      body: question.body
    }
  },

  returnArrayOfQuestionIdForGame(questionArr){
    const arrayId = questionArr.map(question => question.questionId)
    return arrayId
  }
};
