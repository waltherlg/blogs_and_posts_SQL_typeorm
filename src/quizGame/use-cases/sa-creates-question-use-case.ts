import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { QuestionsRepository } from "../questions.repository";



export class SaCreateQuestionCommand {
    constructor(public questionCreateInputDto){}
}
//TODO need finish
@CommandHandler(SaCreateQuestionCommand)
export class SaCreateQuestionUseCase implements ICommandHandler<SaCreateQuestionCommand>{
    constructor(private readonly questionRepository: QuestionsRepository){}
    
    async execute(command: SaCreateQuestionCommand): Promise<any> {
        
    }
}
