import { IsArray, IsBoolean, Length } from 'class-validator';
import { StringTrimNotEmpty } from '../middlewares/validators';
import { Entity, PrimaryColumn, Column } from 'typeorm';

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

type questionGameType = {
  id: string,
  body: string
}

enum enumStatusGameType {
  'PendingSecondPlayer', 'Active', 'Finished'
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

@Entity({name: 'QuizGame'})
export class QuizGame {
  @PrimaryColumn('uuid')
  quizGameId: string;
  @Column({type: 'enum', enum: enumStatusGameType})
  status: string;
  @Column({ type: 'timestamptz' })
  pairCreatedDate: string
  @Column({ type: 'timestamptz' })
  startGameDate: string
  @Column({ type: 'timestamptz' })
  finishGameDate: string

  @Column({ type: 'jsonb' })
  questions: questionGameType[];

  @Column('uuid')
  player1Id: string;
  @Column({ type: 'jsonb' })
  player1Answers: answerGameType[];
  @Column({default: 0})
  player1Score: number

  @Column({type: 'uuid', nullable: true})
  player2Id: string;
  @Column({ type: 'jsonb' })
  player2Answers: answerGameType[];
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