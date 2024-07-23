import { Body, Controller, Get, Post } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  TelegramAdapter,
  TelegramUpdateMessage,
} from '../adapters/telegram.adapter';
const axios = require('axios');

@Controller('notification')
export class NotificationController {
  constructor(private readonly telegramAdapter: TelegramAdapter) {}

  @Post('telegram')
  async forTelegramm(@Body() payload: TelegramUpdateMessage) {
    console.log(payload);
    this.telegramAdapter.sendMessageToTelegramm(
      `Привет, ${payload.message.from.first_name} , ты мне только что написал ${payload.message.text}`,
      payload.message.from.id,
    );
    return { status: 'success' };
  }
}
