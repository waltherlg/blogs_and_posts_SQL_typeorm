import { IsArray, IsBoolean, Length, Validate } from 'class-validator';
import { CustomIsBoolean, StringTrimNotEmpty } from '../middlewares/validators';
import { Entity, PrimaryColumn, Column } from 'typeorm';
import { Transform } from 'class-transformer';

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
  @Transform((value)=> {
    return value.obj.published
  })
  @IsBoolean()
  published: boolean;
}

export class QuestionDbType {
  constructor(
    public questionId: string,
    public body: string,
    public correctAnswers: any[],
    public published: boolean,
    public createdAt: string,
    public updatedAt: string | null,
  ) {}

  returnForGame() {
    return {
      id: this.questionId,
      body: this.body,
    };
  }
}

export type questionOutputSaType = {
  id: string;
  body: string;
  correctAnswers: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string | null;
};

@Entity({ name: 'Questions' })
export class Questions {
  @PrimaryColumn('uuid')
  questionId: string;
  @Column()
  body: string;
  @Column({ type: 'jsonb' })
  correctAnswers: string[];
  @Column()
  published: boolean;
  @Column({ type: 'timestamptz' })
  createdAt: string;
  @Column({ type: 'timestamptz', nullable: true })
  updatedAt: string | null;

  returnForGame() {
    return {
      id: this.questionId,
      body: this.body,
    };
  }
}
