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
import { UserActivateTelegramBotCommand } from './use-cases/user-activate-telegram-bot-use-case';
const axios = require('axios');

@Controller('integrations')
export class IntegrationsController {
  constructor(private readonly telegramAdapter: TelegramAdapter,
              private readonly commandBus: CommandBus
  ) {}

  @Post('telegram')
  async forTelegramm(@Body() payload: TelegramUpdateMessage) {
    console.log('payload ', payload);

    if (!payload.message && !payload.message.from.id){
      console.log('no payload');
      return      
    }
          
    const messageText = payload.message.text
    const telegramId = payload.message.from.id.toString()

    if(messageText.startsWith('/start')){
        const startIndex = messageText.lastIndexOf(' ')
        if ( startIndex !== -1 ) {
          const startParam = messageText.substring(startIndex + 1).trim()
          if(startParam && startParam.startsWith('code=')) {
            const code = startParam.split('code=')[1]
            const result = await this.commandBus.execute(new UserActivateTelegramBotCommand(code, telegramId))
            handleActionResult(result)
            this.telegramAdapter.sendMessageToTelegramm(
              `Привет, ${payload.message.from.first_name} , активация бота прошла успешно! `,
              payload.message.from.id,)
          }
        } else {
          this.telegramAdapter.sendMessageToTelegramm(
            `Привет, ${payload.message.from.first_name} , ты уже активировал бота, на этом мои полномочия всё `,
            payload.message.from.id,
          );

          
        }
    }
 
    if(!messageText.startsWith('/start')) {
      console.log('-- no start --');

      this.telegramAdapter.sendMessageToTelegramm(
      `Привет, ${payload.message.from.first_name} , ты уже активировал бота, на этом мои полномочия всё `,
      payload.message.from.id,

      // this.telegramAdapter.sendMessageToTelegramm(
      //   `Привет, ${payload.message.from.first_name} , ты уже активировал бота, на этом мои полномочия всё ${payload.message.text}`,
      //   payload.message.from.id,
    );
    //return { status: 'success' };
    return  
    } 


      
      

      


    


    

  }

  @UseGuards(JwtAuthGuard)
  @Get('telegram/auth-bot-link')
  async getTelegramBotLink(@Req() request){
    const result = await this.commandBus.execute(new UserReqAuthBotLinkCommand(request.user.userId))
    handleActionResult(result)
    return result

  }
}
