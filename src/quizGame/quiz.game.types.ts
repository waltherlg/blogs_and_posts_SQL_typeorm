import { IsArray, Length } from "class-validator";
import { StringTrimNotEmpty } from "../middlewares/validators";

export class CreateQuestionImputModelType {
    @StringTrimNotEmpty()
    @Length(10, 500)
    body: string;
    @IsArray()
    correctAnswers: [];
}