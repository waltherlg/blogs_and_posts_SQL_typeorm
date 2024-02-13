import { enumAnswerGameStatus } from '../../../src/quizGame/quiz.answers.types';

export const testAnswerBody = {
  correctAnswerInput: { answer: 'universal correct answer' },
  incorrectAnswerInput: { answer: 'universal incorrect answer' },
  correctAnswerOutput: {
    questionId: expect.any(String),
    answerStatus: enumAnswerGameStatus.Correct,
    addedAt: expect.any(String),
  },
  incorrectAnswerOutput: {
    questionId: expect.any(String),
    answerStatus: enumAnswerGameStatus.Incorrect,
    addedAt: expect.any(String),
  },
};
