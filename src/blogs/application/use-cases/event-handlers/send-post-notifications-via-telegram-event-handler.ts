import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { TelegramAdapter } from '../../../../adapters/telegram.adapter';

export class SendPostNotificationsViaTelegramEvent {
  constructor(public text: string, public telegramIds: string[]) {}
}

@EventsHandler(SendPostNotificationsViaTelegramEvent)
export class SendPostNotificationsViaTelegramEventHandler
  implements IEventHandler<SendPostNotificationsViaTelegramEvent>
{
  constructor(private readonly telegramAdapter: TelegramAdapter) {}

  handle(event: SendPostNotificationsViaTelegramEvent) {}
}
