import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  TelegramAdapter,
  TelegramUpdateMessage,
} from '../adapters/telegram.adapter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
const axios = require('axios');

@Controller('integrations')
export class IntegrationsController {
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

  @UseGuards(JwtAuthGuard)
  @Get('telegram/auth-bot-link')
  async getTelegramBotLink(@Req() request){

  }
}
