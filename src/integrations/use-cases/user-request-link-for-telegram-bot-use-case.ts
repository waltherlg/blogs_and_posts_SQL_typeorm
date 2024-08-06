import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { TelegramAdapter } from "../../adapters/telegram.adapter";
import { UsersRepository } from "../../users/users.repository";
import { Users } from "../../users/user.entity";
import { ActionResult } from "../../helpers/enum.action.result.helper";
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
const telegramBotName = process.env.TELEGRAM_BOT_NAME

export class UserReqAuthBotLinkCommand {
    constructor(public userId: string) {}
}

@CommandHandler(UserReqAuthBotLinkCommand)
export class UserReqAuthBotLinkUseCase 
implements ICommandHandler<UserReqAuthBotLinkCommand>{
    constructor(
        private readonly telegramAdapter: TelegramAdapter,
        private readonly usersRepository: UsersRepository){}

        async execute(command: UserReqAuthBotLinkCommand): Promise<any> {
            const user: Users = await this.usersRepository.getUserDBTypeById(command.userId)
            if(!user) return ActionResult.UserNotFound

            const telegramActivationCode = uuidv4()

            user.telegramActivationCode = telegramActivationCode

            const saveResult = await this.usersRepository.saveUserChanges(user)
            if(!saveResult) return ActionResult.NotSaved

            const telegramAuthLink = {link: `https://t.me/${telegramBotName}?start=code=${telegramActivationCode}`}
            return telegramAuthLink
        }
}