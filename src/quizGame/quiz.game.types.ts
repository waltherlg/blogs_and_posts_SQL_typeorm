import { IsArray, IsBoolean, Length } from 'class-validator';
import { StringTrimNotEmpty } from '../middlewares/validators';
import { Entity, PrimaryColumn, Column } from 'typeorm';

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
  published: boolean;
}

export class QuestionDbType {
  constructor(
    public questionId: string,
    public body: string,
    public correctAnswers: any[],
    public published: boolean,
    public createdAt: string,
    public updatedAt: string,
  ) {}
}

export type questionOutputSaType = {
  id: string;
  body: string;
  correctAnswers: any[];
  published: boolean;
  createdAt: string;
  updatedAt: string;
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
  @Column({ type: 'timestamptz' })
  updatedAt: string;
}
