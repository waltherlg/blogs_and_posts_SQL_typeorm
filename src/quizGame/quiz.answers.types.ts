import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn } from "typeorm";
import { QuizGames } from "./quiz.game.types";

export class QuizAnwswerDbType {
    constructor (
        public answerId: string,
        public gameIndicator: string,
        public questionId: string,
        public ansertStatus: string,
        public addedAt: Date,
    ){}
}

@Entity({name: 'QuizAnswers'})
export class QuizAnswers {
    @PrimaryColumn('uuid')
    answerId: string;
    @Column('uuid')
    gameIndicator: string;
    @Column('uuid')
    public questionId: string;
    @Column()
    public ansertStatus: string;
    @Column({ type: 'timestamptz' })
    public addedAt: Date;

    // @ManyToOne(() => QuizGames, (quizGame) => quizGame.player1Answers)
    // @JoinColumn({ name: 'gameIndicator', referencedColumnName: 'gameIndicatorPlayer1' })
    // quizGamePlayer1: QuizGames;
  
    // @ManyToOne(() => QuizGames, (quizGame) => quizGame.player2Answers)
    // @JoinColumn({ name: 'gameIndicator', referencedColumnName: 'gameIndicatorPlayer2' })
    // quizGamePlayer2: QuizGames;
}







