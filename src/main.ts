import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { addAppSettings } from './helpers/settings';
import * as ngrok from 'ngrok'
import * as dotenv from 'dotenv';
import { CustomisableException } from './exceptions/custom.exceptions';
dotenv.config();
const axios = require('axios')

async function connectNgrok() {
  try {
  const url = await ngrok.connect(3000)
  console.log('ngrok url ', url);
  return url
  } catch (error) {
    console.log(error);
    
    throw new CustomisableException('ngrok url', error, 418)
    
  }

}

async function sendHookToTelegramm(url:string) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  await axios.post(`https://api.telegram.org/bot${token}/setWebhook`, {
    url
  }) 
}

async function bootstrap() {
  const rawApp = await NestFactory.create(AppModule);
  const app = addAppSettings(rawApp);
    // Middleware to add the ngrok header
    app.use((req, res, next) => {
      res.setHeader('ngrok-skip-browser-warning', 'true');
      next();
    });
  await app.listen(3000);

  let baseUrl = await connectNgrok()
  await sendHookToTelegramm(baseUrl + '/notification/telegram')
}
bootstrap();
