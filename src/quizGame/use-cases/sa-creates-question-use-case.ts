import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { CreateQuestionImputModelType, QuestionDbType } from "../quiz.game.types";
import { v4 as uuidv4 } from 'uuid';



export class SaCreateQuestionCommand {
    constructor(public questionCreateInputDto: CreateQuestionImputModelType){}
}
//TODO need finish
@CommandHandler(SaCreateQuestionCommand)
export class SaCreateQuestionUseCase implements ICommandHandler<SaCreateQuestionCommand>{
    constructor(){}
    async execute(command: SaCreateQuestionCommand): Promise<any> {
        const questionDto = new QuestionDbType(
            uuidv4(),
            command.questionCreateInputDto.body,
            command.questionCreateInputDto.correctAnswers,
            false,
            new Date().toISOString(),
            new Date().toISOString(),            
        )
        
    }
}
