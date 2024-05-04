import {
  Entity,
  PrimaryColumn,
  Column,
  ManyToOne,
  JoinColumn,
  ManyToMany,
  JoinTable,
  OneToMany,
} from 'typeorm';
import { Users } from '../users/user.entity';
import { QuestionDbType, Questions } from './quiz.questions.types';
import { QuizAnswers, enumAnswerGameStatus } from './quiz.answers.types';
import { UserDBType } from '../users/users.types';

type answerGameType = {
  questionId: string;
  answerStatus: enumAnswerGameStatus;
  addedAt: string;
};

type playerGameType = {
  id: string;
  login: string;
};

type playerGameProgressType = {
  answers: answerGameType[];
  player: playerGameType;
  score: number;
};

export type questionGameType = {
  id: string;
  body: string;
};

export enum enumStatusGameType {
  PendingSecondPlayer = 'PendingSecondPlayer',
  Active = 'Active',
  Finished = 'Finished',
}

export type outputGameQuizType = {
  id: string;
  firstPlayerProgress: playerGameProgressType;
  secondPlayerProgress: playerGameProgressType;
  questions: questionGameType[];
  status: enumStatusGameType;
  pairCreatedDate: string;
  startGameDate: string;
  finishGameDate: string;
};

export class PlayerDtoType {
  constructor(public id: string, public login: string) {}
}

export class QuizGameDbType {
  constructor(
    public quizGameId: string,
    public status: enumStatusGameType,
    public pairCreatedDate: Date,
    public startGameDate: Date | null,
    public finishGameDate: Date | null,
    public answers: QuizAnswers[],
    public player1: UserDBType,
    public player1Score: number,
    public player2: UserDBType,
    public player2Score: number,
    public questions: Questions[],
  ) {}
}

@Entity({ name: 'QuizGames' })
export class QuizGames extends QuestionDbType {
  @PrimaryColumn('uuid')
  quizGameId: string;
  @Column()
  status: enumStatusGameType;
  @Column({ type: 'timestamptz' })
  pairCreatedDate: Date;
  @Column({ type: 'timestamptz', nullable: true })
  startGameDate: Date;
  @Column({ type: 'timestamptz', nullable: true })
  finishGameDate: Date;

  @OneToMany(() => QuizAnswers, (a) => a.QuizGames, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
    cascade: true,
  })
  answers: QuizAnswers[];

  @ManyToOne(() => Users, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'player1Id' })
  player1: Users;

  @Column()
  player1Score: number;

  @ManyToOne(() => Users, { eager: true, nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'player2Id' })
  player2: Users | null;

  @Column()
  player2Score: number;

  @ManyToMany(() => Questions, {
    eager: true,
    nullable: true,
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinTable()
  questions: Questions[];

  returnForPlayer() {
    if (this.status === enumStatusGameType.PendingSecondPlayer) {
      const game: outputGameQuizType = {
        id: this.quizGameId,
        firstPlayerProgress: {
          answers: [],
          player: {
            id: this.player1.userId,
            login: this.player1.login,
          },
          score: this.player1Score,
        },
        secondPlayerProgress: null,
        questions: null,
        status: enumStatusGameType.PendingSecondPlayer,
        pairCreatedDate: this.pairCreatedDate.toISOString(),
        startGameDate: null,
        finishGameDate: null,
      };
      return game;
    }
    if (this.status === enumStatusGameType.Active) {
      const game: outputGameQuizType = {
        id: this.quizGameId,
        firstPlayerProgress: {
          answers: this.answers
            .filter((answer) => answer.playerNumber === 1)
            .sort(
              (a, b) =>
                new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
            )
            .map((answer) => answer.returnForPlayer()),
          player: {
            id: this.player1.userId,
            login: this.player1.login,
          },
          score: this.player1Score,
        },
        secondPlayerProgress: {
          answers: this.answers
            .filter((answer) => answer.playerNumber === 2)
            .sort(
              (a, b) =>
                new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
            )
            .map((answer) => answer.returnForPlayer()),
          player: {
            id: this.player2.userId,
            login: this.player2.login,
          },
          score: this.player2Score,
        },
        questions: this.questions
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          .map((question) => question.returnForGame()),
        status: this.status,
        pairCreatedDate: this.pairCreatedDate.toISOString(),
        startGameDate: this.startGameDate.toISOString(),
        finishGameDate: null,
      };
      return game;
    }
    if (this.status === enumStatusGameType.Finished) {
      const game: outputGameQuizType = {
        id: this.quizGameId,
        firstPlayerProgress: {
          answers: this.answers
            .filter((answer) => answer.playerNumber === 1)
            .sort(
              (a, b) =>
                new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
            )
            .map((answer) => answer.returnForPlayer()),
          player: {
            id: this.player1.userId,
            login: this.player1.login,
          },
          score: this.player1Score,
        },
        secondPlayerProgress: {
          answers: this.answers
            .filter((answer) => answer.playerNumber === 2)
            .sort(
              (a, b) =>
                new Date(a.addedAt).getTime() - new Date(b.addedAt).getTime(),
            )
            .map((answer) => answer.returnForPlayer()),
          player: {
            id: this.player2.userId,
            login: this.player2.login,
          },
          score: this.player2Score,
        },
        questions: this.questions
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
          )
          .map((question) => question.returnForGame()),
        status: this.status,
        pairCreatedDate: this.pairCreatedDate.toISOString(),
        startGameDate: this.startGameDate.toISOString(),
        finishGameDate: this.startGameDate.toISOString(),
      };
      return game;
    }
  }

  private swapPlayerNumber = (num) => {
    if (num === 1) {
      return 2;
    } else if (num === 2) {
      return 1;
    } else {
      return 0;
    }
  };

  getStatisticForCurrentGameAndUser(playerId) {
    const currentUserStatistic = {
      score: 0,
      gameStatus: 'None',
    };

    let currentPlayerNumber = 0;
    if (playerId === this.player1.userId) {
      currentPlayerNumber = 1;
    } else if (playerId === this.player2.userId) {
      currentPlayerNumber = 2;
    } else {
      //TODO: можно ли возвращать нал
      // return null
      console.log('wrong player');
    }
    const playerScores = {
      1: this.player1Score,
      2: this.player2Score,
    };

    currentUserStatistic.score = playerScores[currentPlayerNumber];

    if (
      playerScores[currentPlayerNumber] >
      playerScores[this.swapPlayerNumber(currentPlayerNumber)]
    ) {
      currentUserStatistic.gameStatus = 'win';
    } else if (
      playerScores[currentPlayerNumber] ===
      playerScores[this.swapPlayerNumber(currentPlayerNumber)]
    ) {
      currentUserStatistic.gameStatus = 'draw';
    } else {
      currentUserStatistic.gameStatus = 'lose';
    }
    return currentUserStatistic;
  }

  numberOfCurrentPlayer(playerId) {
    if (playerId === this.player1.userId) {
      return 1;
    }
    if (playerId === this.player2.userId) {
      return 2;
    }
    return 0;
  }
}
