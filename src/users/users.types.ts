

import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'Users' })
export class Users {
  @PrimaryGeneratedColumn('uuid')
  userId: string;
  @Column()
  login: string;
  @Column()
  passwordHash: string;
  @Column()
  email: string;
  @Column()
  createdAt: string;
  @Column()
  isUserBanned: boolean;
  @Column()
  banDate: string | null;
  @Column()
  banReason: string | null;
  @Column()
  confirmationCode: string | null;
  @Column({type: 'timestamptz'})
  expirationDateOfConfirmationCode: Date | null;
  @Column()
  isConfirmed: boolean;
  @Column()
  passwordRecoveryCode: string | null;
  @Column({type: 'timestamptz'})
  expirationDateOfRecoveryCode: Date | null;
}

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

export type NewCreatedUserTypeOutput = {
  id: string;
  login: string;
  email: string;
  createdAt: string;
};

export type PasswordRecoveryModel = {
  email: string;
  passwordRecoveryCode: string;
  expirationDateOfRecoveryCode: Date;
};
