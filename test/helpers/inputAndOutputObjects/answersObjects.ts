import { enumAnswerGameStatus } from "../../../src/quizGame/quiz.answers.types";

export const testAnswerBody = {
  correctAnswerInput: { body: 'universal correct answer' },
  incorrectAnswerInput: { body: 'universal incorrect answer' },
  correctAnswerOutput: { 
    questionId: expect.any(String),
    answerStatus: enumAnswerGameStatus.Correct,
    addedAt: expect.any(String)
   },
  incorrectAnswerOutput: { 
    questionId: expect.any(String),
    answerStatus: enumAnswerGameStatus.Incorrect,
    addedAt: expect.any(String)
   },
};
