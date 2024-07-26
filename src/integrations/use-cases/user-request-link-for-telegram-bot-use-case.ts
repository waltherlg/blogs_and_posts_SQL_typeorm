import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TelegramAdapter } from "../../adapters/telegram.adapter";

export class UserReqAuthBotLinkCommand {
    constructor(public userId: string) {}
}

@CommandHandler(UserReqAuthBotLinkCommand)
export class UserReqAuthBotLinkUseCase 
implements ICommandHandler<UserReqAuthBotLinkCommand>{
    constructor(
        private readonly telegramAdapter: TelegramAdapter){}

        async execute(command: UserReqAuthBotLinkCommand): Promise<any> {
            
        }
}