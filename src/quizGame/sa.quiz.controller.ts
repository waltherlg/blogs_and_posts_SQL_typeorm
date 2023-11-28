import { Controller, Delete, Get, HttpCode, Post, Put } from "@nestjs/common";
import { CommandBus } from "@nestjs/cqrs";

@Controller('quiz')
export class SaQuizController {
constructor(private readonly commandBus: CommandBus){}

    @Get('questions')
    @HttpCode(200)
    //TODO
    // get all question with pagination
    async getAllQuestions(){

    }

    @Post('questions')
    @HttpCode(200)
    //TODO
    //create questions for quizGame
    async createQuestion(){

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