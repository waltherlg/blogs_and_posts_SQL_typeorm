import { Injectable } from "@nestjs/common";
import axios from 'axios';
//const secretKey = process.env.RECAPTCHA_SECRET_KEY

@Injectable()
export class RecaptchaAdapter {
    async validateRecaptcha(recaptchaResponse: string): Promise<boolean> {
        const secretKey = process.env.RECAPTCHA_SECRET_KEY; // Секретный ключ reCAPTCHA
        const url = `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${recaptchaResponse}`;
    
        try {
            const response = await axios.post(url);
            const data = response.data;

            console.log(data); // Выводим данные для отладки

            if (data.success && data.score > 0.5) { // Убедись, что score выше 0.5
                return true;
            } else {
                console.error('Low score or invalid reCAPTCHA');
                return false;
            }
        } catch (error) {
            console.error('Error validating reCAPTCHA:', error);
            return false;
        }
    }
}