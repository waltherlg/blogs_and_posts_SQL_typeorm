import { Column, Entity, JoinColumn, ManyToMany, PrimaryColumn } from 'typeorm';
import { QuizGames } from './quiz.game.types';


export class QuizAnwswerDbType {
  constructor(
    public answerId: string,
    public gameIndicator: string,
    public questionId: string,
    public answerStatus: string,
    public addedAt: Date,
  ) {}
}


@Entity({ name: 'QuizAnswers' })
export class QuizAnswers {
  @PrimaryColumn('uuid')
  answerId: string;

  @ManyToMany(() => QuizGames)
  @JoinColumn({ name: 'gamePlayerIndicator' })
  QuizGames: QuizGames;

  @Column('uuid')
  gamePlayerIndicator: string;

  @Column('uuid')
  questionId: string;
  @Column()
  ansertStatus: string;
  @Column({ type: 'timestamptz' })
  addedAt: Date;

  // @ManyToOne(() => QuizGames, (quizGame) => quizGame.player1Answers)
  // @JoinColumn({ name: 'gameIndicator', referencedColumnName: 'gameIndicatorPlayer1' })
  // quizGamePlayer1: QuizGames;

  // @ManyToOne(() => QuizGames, (quizGame) => quizGame.player2Answers)
  // @JoinColumn({ name: 'gameIndicator', referencedColumnName: 'gameIndicatorPlayer2' })
  // quizGamePlayer2: QuizGames;
}
