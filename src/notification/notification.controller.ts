import { Body, Controller, Get, Post } from "@nestjs/common";
import * as dotenv from 'dotenv';
const axios = require('axios')

@Controller('notification')
export class NotificationController {
    constructor(){}

@Post('telegram')
async forTelegramm(@Body() payload: any){
    console.log(payload);
    return {status: 'success'}
}
}

async function sendMassegeToTelegramm(text:string, recipientId: number) {
    const token = process.env.TELEGRAM_BOT_TOKEN
    await axios.post(`https://api.telegram.org/bot${token}/sendMessage`, {
      chat_id: recipientId,
      text: text
    }) 
}