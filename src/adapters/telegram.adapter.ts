import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
const axios = require('axios');

@Injectable()
export class TelegramAdapter {
  constructor() {}

  async sendMessageToTelegramm(text: string, recipientId: number) {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: recipientId,
      text: text,
    });
  }
}
export type TelegramUpdateMessage = {
  message: {
    id: number;
    from: {
      id: number;
      first_name: string;
      last_name: string;
    };
    text: string;
  };
};
