import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";



export class SaCreateQuestionCommand {
    constructor(public questionCreateInputDto){}
}
//TODO need finish
@CommandHandler(SaCreateQuestionCommand)
export class SaCreateQuestionUseCase implements ICommandHandler<SaCreateQuestionCommand>{
    constructor(){}
    async execute(command: SaCreateQuestionCommand): Promise<any> {
        
    }
}
