import { IsArray, IsBoolean, Length } from 'class-validator';
import { StringTrimNotEmpty } from '../middlewares/validators';
import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Users } from 'src/users/user.entity';

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
    public questions: Array<string>,
    public player1Id: string,
    public player1Answers: Array<string>,
    public player1Score: number,
    public player2Id: string,
    public player2Answers: Array<string>,
    public player2Score: number,
  ){}
}

@Entity({name: 'QuizGames'})
export class QuizGames {
  @PrimaryColumn('uuid')
  quizGameId: string;
  @Column()
  status: string;
  @Column({ type: 'timestamptz' })
  pairCreatedDate: Date
  @Column({ type: 'timestamptz' })
  startGameDate: Date
  @Column({ type: 'timestamptz' })
  finishGameDate: Date
  @Column({ type: 'jsonb' })
  questions: Array<string>;
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'player1Id' })
  player1: Users;
  @Column('uuid')
  player1Id: string;
  @Column({ type: 'jsonb' })
  player1Answers: Array<string>;
  @Column({default: 0})
  player1Score: number
  @ManyToOne(() => Users, { nullable: true })
  @JoinColumn({ name: 'player2Id' })
  player2: Users;
  @Column({type: 'uuid', nullable: true})
  player2Id: string;
  @Column({ type: 'jsonb' })
  player2Answers: Array<string>;
  @Column({default: 0})
  player2Score: number
}

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