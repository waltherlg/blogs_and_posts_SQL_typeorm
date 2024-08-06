import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import * as dotenv from 'dotenv';
import {
  TelegramAdapter,
  TelegramUpdateMessage,
} from '../adapters/telegram.adapter';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { UserReqAuthBotLinkCommand } from './use-cases/user-request-link-for-telegram-bot-use-case';
import { handleActionResult } from '../helpers/enum.action.result.helper';
import { log } from 'console';
const axios = require('axios');

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly telegramAdapter: TelegramAdapter,
              private readonly commandBus: CommandBus
  ) {}

  @Post('telegram')
  async forTelegramm(@Body() payload: TelegramUpdateMessage, @Query() code) {
    console.log('payload ', payload);
    console.log('code ', code);
    
    this.telegramAdapter.sendMessageToTelegramm(
      `Привет, ${payload.message.from.first_name} , ты мне только что написал ${payload.message.text}`,
      payload.message.from.id,
    );
    return { status: 'success' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('telegram/auth-bot-link')
  async getTelegramBotLink(@Req() request){
    const result = await this.commandBus.execute(new UserReqAuthBotLinkCommand(request.user.userId))
    handleActionResult(result)
    return result

  }
}
