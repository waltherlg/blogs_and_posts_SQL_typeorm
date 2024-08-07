import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { UsersRepository } from "../../users/users.repository";
import { Users } from "../../users/user.entity";
import { ActionResult } from "../../helpers/enum.action.result.helper";

export class UserActivateTelegramBotCommand {
    constructor(
        public activationCode: string,
        public telegramId: string) {}
}

@CommandHandler(UserActivateTelegramBotCommand)
export class UserActivateTelegramBotUseCase 
implements ICommandHandler<UserActivateTelegramBotCommand>{
    constructor(
        private readonly usersRepository: UsersRepository){}

        async execute(command: UserActivateTelegramBotCommand): Promise<any> {
            const user: Users = await this.usersRepository.getUserDBTypeByTelegramCode(command.activationCode)
            if(!user) return ActionResult.UserNotFound

            user.telegramId = command.telegramId
            user.telegramActivationCode = null

            const saveResult = await this.usersRepository.saveUserChanges(user)
            if(!saveResult) return ActionResult.NotSaved
            return ActionResult.Success
        }
}