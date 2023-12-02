import { QuestionDbType } from "../quiz.game.types"

export const questionMapper = {
    forSa(question: QuestionDbType){
        return {
            id: question.questionId,
            body: question.body,
            correctAnswers: question.correctAnswers,
            published: question.published,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
        }
    }
}