// import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from "typeorm";
// import { QuizGames } from "./quiz.game.types";

// export class QuizAnwswerDbType {
//     constructor (
//         public answerId: string,
//         public userId: string,
//         public quizGameId: string,
//         public questionId: string,
//         public ansertStatus: string,
//         public addedAt: string,
//     ){}
// }

// @Entity({name: 'QuizAnswer'})
// export class QuizAnswer









// export class QuizAnswersDbType {
//     constructor(
//         public answersId: string,
//         public gameId: string,
//         public answer1Id: string,
//         public answer2Id: string,
//         public answer3Id: string,
//         public answer4Id: string,
//         public answer5Id: string,
//     ){}
// }

// @Entity({name: 'QuizAnswers'})
// export class QuizAnswers {
//     @PrimaryColumn('uuid')
//     answersId: string;
//     @OneToOne(()=> QuizGames)
//     @JoinColumn({name: 'quizGameId'})
//     QuizGames: QuizGames
//     @Column('uuid')
//     quizGameId: string;
//     @Column({ type: 'uuid', nullable: true })
//     answer1Id: string;
//     @Column({ type: 'uuid', nullable: true })
//     answer2Id: string;
//     @Column({ type: 'uuid', nullable: true })
//     answer3Id: string;
//     @Column({ type: 'uuid', nullable: true })
//     answer4Id: string;
//     @Column({ type: 'uuid', nullable: true })
//     answer5Id: string;
// }