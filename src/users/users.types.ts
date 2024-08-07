import { PlayerStatistic } from '../quizGame/quiz.game.statistic.type';

export type CommentsLikeType = {
  commentsId: string;
  createdAt: Date;
  status: string;
};

export type PostsLikeType = {
  postsId: string;
  createdAt: Date;
  status: string;
};

export class UserDBType {
  constructor(
    public userId: string,
    public login: string,
    public passwordHash: string,
    public email: string,
    public createdAt: string,
    public isUserBanned: boolean,
    public banDate: string | null,
    public banReason: string | null,
    public confirmationCode: string | null,
    public expirationDateOfConfirmationCode: Date | null,
    public isConfirmed: boolean,
    public passwordRecoveryCode: string | null,
    public expirationDateOfRecoveryCode: Date | null,
    public playerStatistic: PlayerStatistic,
    public telegramId: string | null = null,
    public telegramActivationCode: string | null = null,
  ) {}
}

export type UserTypeOutput = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: {
    isBanned: boolean;
    banDate: string | null;
    banReason: string | null;
  };
};

export type UserTypeOutputForSa = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type NewCreatedUserTypeOutput = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type NewCreatedUserTypeOutputSa = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
  banInfo: {
    isBanned: boolean;
    banDate: string | null;
    banReason: string | null;
  };
};

export type PasswordRecoveryModel = {
  email: string;
  passwordRecoveryCode: string;
  expirationDateOfRecoveryCode: Date;
};
