import { Body, Controller, Get, Post } from "@nestjs/common";

@Controller('notification')
export class NotificationController {
    constructor(){}

@Post('telegram')
async forTelegramm(@Body() payload: any){
    console.log(payload);
    return {status: 'success'}
}
}