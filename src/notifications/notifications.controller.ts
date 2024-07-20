import { Body, Controller, Get } from "@nestjs/common";

@Controller('notification')
export class NotificationController {
    constructor(){}

@Get('telegramm')
async forTelegramm(@Body() payload: any){
    console.log(payload);
    return {status: 'success'}
}
}