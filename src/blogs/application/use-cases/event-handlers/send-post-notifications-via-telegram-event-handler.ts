import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TelegramAdapter } from '../../../../adapters/telegram.adapter';
import { BlogsRepository } from '../../../infrostracture/blogs.repository';

export class SendPostNotificationsViaTelegramEvent {
  constructor(public blogId: string) {}
}

@EventsHandler(SendPostNotificationsViaTelegramEvent)
export class SendPostNotificationsViaTelegramEventHandler
  implements IEventHandler<SendPostNotificationsViaTelegramEvent>
{
  constructor(private readonly telegramAdapter: TelegramAdapter,
    private readonly blogsRepository: BlogsRepository
  ) {}

  async handle(event: SendPostNotificationsViaTelegramEvent) {

    const idsSearchResult = await this.blogsRepository.getSubscribersTelegramIds(event.blogId);
    const { blogName, telegramIds: subsTelegramIds } = idsSearchResult



      await this.telegramAdapter.sendMessagesToMultipleRecipients(
        `Вы подписаны на блог "${blogName}", его автор выложил новый пост! `,
        subsTelegramIds,
      );
  }
}
