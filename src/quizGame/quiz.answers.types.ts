import { Column, Entity, JoinColumn, ManyToMany, ManyToOne, PrimaryColumn } from 'typeorm';
import { QuizGames } from './quiz.game.types';
import { StringTrimNotEmpty } from 'src/middlewares/validators';
import { Length } from 'class-validator';

export class AnswerInputModelType {
  @StringTrimNotEmpty()
  @Length(0, 500)
  body: string;
}

export class QuizAnwswerDbType {
  constructor(
    public answerId: string,
    public playerNumber: number,
    public questionId: string,
    public body: string,
    public answerStatus: string,
    public addedAt: Date,
  ) {}
}


@Entity({ name: 'QuizAnswers' })
export class QuizAnswers {
  @PrimaryColumn('uuid')
  answerId: string;

  @Column()
  playerNumber: number;

  @Column('uuid')
  questionId: string;
  @Column()
  body: string;
  @Column()
  answerStatus: string;
  @Column({ type: 'timestamptz' })
  addedAt: Date;
}
