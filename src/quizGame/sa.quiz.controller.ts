import { Controller, Delete, Get, HttpCode, Post, Put } from "@nestjs/common";

@Controller('quiz')
export class SaQuizController {
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