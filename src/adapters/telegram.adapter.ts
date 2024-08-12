import { Injectable } from '@nestjs/common';
import * as dotenv from 'dotenv';
const axios = require('axios');
import { AxiosInstance } from 'axios';

@Injectable()
export class TelegramAdapter {
  private axiosInstance: AxiosInstance;
  constructor() {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    this.axiosInstance = axios.create({
      baseURL: `https://api.telegram.org/bot${token}/`,
    });
  }

  async sendMessageToTelegram(text: string, recipientId: string) {
    await this.axiosInstance.post(`sendMessage`, {
      chat_id: +recipientId,
      text: text,
    });
  }

  async sendHookToTelegram(url: string) {
    await this.axiosInstance.post(`setWebhook`, {
      url: url,
    });
  }

  async sendMessagesToMultipleRecipients(
    text: string,
    recipientIds: string[],
  ): Promise<boolean> {
    try {
      const sendMessagesPromises = recipientIds.map((recipientId) =>
        this.sendMessageToTelegram(text, recipientId),
      );
      await Promise.all(sendMessagesPromises);
      return true;
    } catch (error) {
      console.error('Error sending messages to multiple recipients:', error);
      return false;
    }
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
