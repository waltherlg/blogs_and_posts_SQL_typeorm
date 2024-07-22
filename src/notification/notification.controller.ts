import { Body, Controller, Get, Post } from "@nestjs/common";
import * as dotenv from 'dotenv';
const axios = require('axios')

@Controller('notification')
export class NotificationController {
    constructor(){}

@Post('telegram')
async forTelegramm(@Body() payload: TelegramUpdateMessage){
    console.log(payload);
    sendMessageToTelegramm(`Привет, ${payload.message.from.first_name} , ты мне только что написал ${payload.message.text}`, payload.message.from.id)
    return {status: 'success'}
}
}

async function sendMessageToTelegramm(text:string, recipientId: number) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: recipientId,
      text: text
    }) 
}

export type TelegramUpdateMessage = {
    message: {
        id: number
        from: {
            id: number
            first_name: string,
            last_name: string
        }
        text: string
    }

}