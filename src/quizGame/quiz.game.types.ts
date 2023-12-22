import { IsArray, IsBoolean, Length } from 'class-validator';
import { StringTrimNotEmpty } from '../middlewares/validators';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, ManyToMany, JoinTable, OneToMany, OneToOne } from 'typeorm';
import { Users } from '../users/user.entity';
import { Questions } from './quiz.questions.types';
import { QuizAnswers } from './quiz.answers.types';

enum enumAnswerGameStatus {'Correct', 'Incorrect'}

type answerGameType = {
    questionId: string,
    answerStatus: enumAnswerGameStatus,
    addedAt: string
}

type playerGameType ={
  id: string,
  login: string
}

type playerGameProgressType = {
    answers: answerGameType[],
    player: playerGameType,
    score: number
}

export type questionGameType = {
  id: string,
  body: string
}

export enum enumStatusGameType {
  PendingSecondPlayer = 'PendingSecondPlayer', Active = 'Active', Finished = 'Finished'
}


export type outputGameQuizType = {
  id: string,
  firstPlayerProgress: playerGameProgressType,
  secondPlayerProgress: playerGameProgressType,
  questions: questionGameType[],
  status: enumStatusGameType,
  pairCreatedDate: string,
  startGameDate: string,
  finishGameDate: string
}

export class QuizGameDbType {
  constructor(
    public quizGameId: string,
    public status: string,    
    public pairCreatedDate: Date,    
    public startGameDate: Date | null,    
    public finishGameDate: Date | null,

    // public player1Id: string,
    public gameIndicatorPlayer1: string,
    // public player1Score: number,

    // public player2Id: string,
    public gameIndicatorPlayer2: string,
    //public player2Score: number,
    public question1Id: string,
    public question2Id: string,
    public question3Id: string,
    public question4Id: string,
    public question5Id: string,
  ){}
}

@Entity({name: 'QuizGames'})
export class QuizGames {
  @PrimaryColumn('uuid')
  quizGameId: string;
  @Column()
  status: string
  @Column({ type: 'timestamptz' })
  pairCreatedDate: Date
  @Column({ type: 'timestamptz' })
  startGameDate: Date
  @Column({ type: 'timestamptz' })
  finishGameDate: Date

  @ManyToMany(() => QuizAnswers, (answer) => answer.QuizGames)
  @JoinColumn({name: 'gameIndicatorPlayer1', referencedColumnName: 'gamePlayerIndicator'})
  QuizAnswersPlayer1: QuizAnswers[];
  @Column('uuid', { unique: true })
  gameIndicatorPlayer1: string;

  @ManyToMany(() => QuizAnswers, (answer) => answer.QuizGames)
  @JoinColumn({name: 'gameIndicatorPlayer2', referencedColumnName: 'gamePlayerIndicator'})
  QuizAnswersPlayer2: QuizAnswers[];
  @Column('uuid', { unique: true })
  gameIndicatorPlayer2: string;

  @ManyToMany(()=> Questions)
  @JoinColumn({name: 'question1Id'})
  Questions1: Questions;
  @Column('uuid')
  question1Id: string;
  @ManyToMany(()=> Questions)
  @JoinColumn({name: 'question2Id'})
  Questions2: Questions;
  @Column('uuid')
  question2Id: string;
  @ManyToMany(()=> Questions)
  @JoinColumn({name: 'question3Id'})
  Questions3: Questions;
  @Column('uuid')
  question3Id: string;
  @ManyToMany(()=> Questions)
  @JoinColumn({name: 'question4Id'})
  Questions4: Questions;
  @Column('uuid')
  question4Id: string;
  @ManyToMany(()=> Questions)
  @JoinColumn({name: 'question5Id'})
  Questions5: Questions;
  @Column('uuid')
  question5Id: string;


}

// @Entity({name: 'QuizGames'})
// export class QuizGames {
//   @PrimaryColumn('uuid')
//   quizGameId: string;
//   @Column()
//   status: string
//   @Column({ type: 'timestamptz' })
//   pairCreatedDate: Date
//   @Column({ type: 'timestamptz' })
//   startGameDate: Date
//   @Column({ type: 'timestamptz' })
//   finishGameDate: Date

//   @OneToOne(() => Users)
//   @JoinColumn({ name: 'player1Id' })
//   player1: Users;
//   @Column('uuid')
//   player1Id: string;

//   @ManyToMany(() => QuizAnswers)
//   @JoinColumn({ name: 'gameIndicatorPlayer1', referencedColumnName: 'gameIndicator' })
//   player1Answers: QuizAnswers[];
//   @Column('uuid', { unique: true })
//   gameIndicatorPlayer1: string;
//   @Column()
//   player1Score: number;

//   @OneToOne(() => Users)
//   @JoinColumn({ name: 'player2Id' })
//   player2: Users;
//   @Column('uuid')
//   player2Id: string;

//   @ManyToMany(() => QuizAnswers )
//   @JoinColumn({ name: 'gameIndicatorPlayer2', referencedColumnName: 'gameIndicator' })
//   player2Answers: QuizAnswers[];
//   @Column('uuid', { unique: true })
//   gameIndicatorPlayer2: string;
//   @Column()
//   player2Score: number;

//   @ManyToMany(()=> Questions)
//   @JoinColumn({name: 'question1Id'})
//   Questions1: Questions;
//   @Column('uuid')
//   question1Id: string;
//   @ManyToMany(()=> Questions)
//   @JoinColumn({name: 'question2Id'})
//   Questions2: Questions;
//   @Column('uuid')
//   question2Id: string;
//   @ManyToMany(()=> Questions)
//   @JoinColumn({name: 'question3Id'})
//   Questions3: Questions;
//   @Column('uuid')
//   question3Id: string;
//   @ManyToMany(()=> Questions)
//   @JoinColumn({name: 'question4Id'})
//   Questions4: Questions;
//   @Column('uuid')
//   question4Id: string;
//   @ManyToMany(()=> Questions)
//   @JoinColumn({name: 'question5Id'})
//   Questions5: Questions;
//   @Column('uuid')
//   question5Id: string;
// }

// port type outputGameQuizType = {
//   id: "string",
//   "firstPlayerProgress": {
//     "answers": [
//       {
//         "questionId": "string",
//         "answerStatus": "Correct",
//         "addedAt": "2023-12-05T04:56:59.947Z"
//       }
//     ],
//     "player": {
//       "id": "string",
//       "login": "string"
//     },
//     "score": 0
//   },
//   "secondPlayerProgress": {
//     "answers": [
//       {
//         "questionId": "string",
//         "answerStatus": "Correct",
//         "addedAt": "2023-12-05T04:56:59.947Z"
//       }
//     ],
//     "player": {
//       "id": "string",
//       "login": "string"
//     },
//     "score": 0
//   },
//   "questions": [
//     {
//       "id": "string",
//       "body": "string"
//     }
//   ],
//   "status": "PendingSecondPlayer",
//   "pairCreatedDate": "2023-12-05T04:56:59.947Z",
//   "startGameDate": "2023-12-05T04:56:59.947Z",
//   "finishGameDate": "2023-12-05T04:56:59.947Z"
// }e



