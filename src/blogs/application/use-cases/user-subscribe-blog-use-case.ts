import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { TelegramAdapter } from '../../../adapters/telegram.adapter';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class UserSubscribeBlogCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(UserSubscribeBlogCommand)
export class UserSubscribeBlogCase
  implements ICommandHandler<UserSubscribeBlogCommand>
{
  constructor(
    private readonly blogRepository: BlogsRepository,
    private readonly telegramAdapter: TelegramAdapter,
  ) {}
  //TODO: UserSubscribeBlogCase
  async execute(command: UserSubscribeBlogCommand): Promise<ActionResult> {
    return ActionResult.Success;
  }
}
