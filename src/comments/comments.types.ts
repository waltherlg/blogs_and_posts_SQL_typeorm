import { Posts } from '../posts/posts.types';
import { Users } from '../users/users.types';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity({ name: 'Comments' })
export class Comments {
  @PrimaryColumn()
  commentId: string;
  @ManyToOne(() => Posts, (p) => p.Comments)
  @JoinColumn({ name: 'postId' })
  Posts: Posts;
  @Column('uuid')
  postId: string;
  @Column()
  content: string;
  @Column()
  createdAt: string;
  @ManyToOne(() => Users, (u) => u.Comments)
  @JoinColumn({ name: 'userId' })
  Users: Users;
  @Column('uuid')
  userId: string;
  @Column()
  likesCount: number;
  @Column()
  dislikesCount: number;
}

export class CommentDBType {
  constructor(
    public commentId: string,
    public postId: string,
    public content: string,
    public createdAt: string,
    public userId: string,
    public likesCount: number,
    public dislikesCount: number,
  ) {}
}

type CommentatorInfoType = {
  userId: string;
  userLogin: string;
};
type LikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
};
export type CommentTypeOutput = {
  id: string;
  content: string;
  commentatorInfo: CommentatorInfoType;
  createdAt: string;
  likesInfo: LikesInfoType;
};
