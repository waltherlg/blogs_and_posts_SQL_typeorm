import { Comments } from '../comments/comments.types';
import { Posts } from '../posts/posts.types';
import { Users } from '../users/users.types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

export class PostLikeDbType {
  constructor(
    public postId: string,
    public addedAt: string,
    public userId: string,
    public login: string,
    public isUserBanned: boolean,
    public status: string,
  ) {}
}

export class CommentLikeDbType {
  constructor(
    public commentId: string,
    public addedAt: string,
    public userId: string,
    public login: string,
    public isUserBanned: boolean,
    public status: string,
  ) {}
}
