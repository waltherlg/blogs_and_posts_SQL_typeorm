import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
const axios = require('axios');
import { AxiosInstance } from 'axios';

@Injectable()
export class TelegramAdapter {
  private axiosInstance: AxiosInstance
  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.axiosInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
    });
  }

  async sendMessageToTelegramm(text: string, recipientId: number) {
    await this.axiosInstance.post(`sendMessage`, {
      chat_id: recipientId,
      text: text,
    });
  }

  async sendHookToTelegramm(url: string) {
    await this.axiosInstance.post(`setWebhook`, {
      url: url,
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
