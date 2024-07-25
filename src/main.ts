import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addAppSettings } from './helpers/settings';
import * as ngrok from 'ngrok';
import * as dotenv from 'dotenv';
import { CustomisableException } from './exceptions/custom.exceptions';
import { TelegramAdapter } from './adapters/telegram.adapter';
dotenv.config();
const axios = require('axios');

async function connectNgrok() {
  try {
    const url = await ngrok.connect(3000);
    console.log('ngrok url ', url);
    return url;
  } catch (error) {
    console.log(error);

    throw new CustomisableException('ngrok url', error, 418);
  }
}

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = addAppSettings(rawApp);
  await app.listen(3000);
  const telegramAdapter = await app.resolve(TelegramAdapter);

  const baseUrl = await connectNgrok();
  await telegramAdapter.sendHookToTelegramm(baseUrl + '/notification/telegram');
}
bootstrap();
