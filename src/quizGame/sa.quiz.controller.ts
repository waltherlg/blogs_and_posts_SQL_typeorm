import { Body, Controller, Delete, Get, HttpCode, Post, Put, UseGuards } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";
import { CreateQuestionImputModelType } from "./quiz.game.types";
import { BasicAuthGuard } from "src/auth/guards/auth.guards";
import { SaCreateQuestionCommand } from "./use-cases/sa-creates-question-use-case";
import { QuestionsRepository } from "./questions.repository";
import { QuestionsQueryRepository } from "./questions.query.repository";

@UseGuards(BasicAuthGuard)
@Controller('quiz')
export class SaQuizController {
constructor(private readonly commandBus: CommandBus,
            private readonly questionQueryRepository: QuestionsQueryRepository){}

    @Get('questions')
    @HttpCode(200)
    //TODO
    // get all question with pagination
    async getAllQuestions(){

    }

    @Post('questions')
    @HttpCode(201)
    //TODO
    //create questions for quizGame
    async createQuestion(@Body()inputQuestionData: CreateQuestionImputModelType ){
        const newQuestionId = await this.commandBus.execute(
            new SaCreateQuestionCommand(
                inputQuestionData
            ))
        const createdQuestion = await this.questionQueryRepository.getQuestionForSaById(newQuestionId)
        return createdQuestion
    }

    @Delete('questions/:questionId')
    @HttpCode(204)
    //TODO
    async deleteQuestionById(){

    }

    @Put('questions/:questionId')
    @HttpCode(204)
    //TODO
    async updateQuestionById(){

    }

    @Put('questions/:questionId/publish')
    @HttpCode(204)
    //TODO
    async publishQuestionById(){
        
    }

}