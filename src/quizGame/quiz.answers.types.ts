import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';
import { QuizGames } from './quiz.game.types';
import { Length } from 'class-validator';
import { StringTrimNotEmpty } from '../middlewares/validators';

//TODO: выяснить, почему при отсутсвии body проходит валидацию
export class AnswerInputModelType {
  @StringTrimNotEmpty()
  @Length(1, 500)
  body: string;
}

export enum enumAnswerGameStatus {
  Correct = 'Correct',
  Incorrect = 'Incorrect',
}

export type QuizAnswerOutputType = {
  questionId: string;
  answerStatus: enumAnswerGameStatus;
  addedAt: string;
};

export class QuizAnwswerDbType {
  constructor(
    public answerId: string,
    public playerNumber: number,
    public questionId: string,
    public body: string,
    public answerStatus: enumAnswerGameStatus,
    public addedAt: Date,
    public QuizGames: QuizGames,
  ) {}
}

@Entity({ name: 'QuizAnswers' })
export class QuizAnswers extends QuizAnwswerDbType {
  @PrimaryColumn('uuid')
  answerId: string;
  @Column()
  playerNumber: number;
  @Column('uuid')
  questionId: string;
  @Column()
  body: string;
  @Column()
  answerStatus: enumAnswerGameStatus;
  @Column({ type: 'timestamptz' })
  addedAt: Date;

  @ManyToOne(() => QuizGames, (g) => g.answers)
  @JoinColumn({ name: 'quizGameId' })
  QuizGames: QuizGames;

  public returnForPlayer(): QuizAnswerOutputType {
    return {
      questionId: this.questionId,
      answerStatus: this.answerStatus,
      addedAt: this.addedAt.toISOString(),
    };
  }
}
