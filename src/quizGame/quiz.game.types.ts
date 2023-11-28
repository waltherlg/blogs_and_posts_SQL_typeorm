import { IsArray, IsBoolean, Length } from "class-validator";
import { StringTrimNotEmpty } from "../middlewares/validators";
import { Entity, PrimaryColumn, Column } from "typeorm";

export class CreateQuestionImputModelType {
    @StringTrimNotEmpty()
    @Length(10, 500)
    body: string;
    @IsArray()
    correctAnswers: [];
}

export class UpdateQuestionImputModelType {
    @StringTrimNotEmpty()
    @Length(10, 500)
    body: string;
    @IsArray()
    correctAnswers: [];
}

export class PublishQuestionImputModelType {
    @IsBoolean()
    published: string;
}

export class QuestionDbType {
    constructor(
        public questionId: string,
        public body: string,
        public correctAnswers: [],
        public published: boolean,
        public createdAt: string,
        public updatedAt: string | null,
    ) {}
}

@Entity({name: 'Questions'})
export class Questions {
    @PrimaryColumn('uuid')
    questionId: string;
    @Column()
    body: string;
    @Column({ type: 'jsonb' })
    correctAnswers: string[];
    @Column()
    published: boolean;
    @Column({ type: 'timestamptz'})
    createdAt: string;
    @Column({ type: 'timestamptz', nullable: true })
    updatedAt: string | null;    
}