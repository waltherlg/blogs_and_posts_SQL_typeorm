
@Entity({ name: 'PostLikes' })
export class PostLikes {
  @PrimaryGeneratedColumn('uuid')
  postLikeId: string;
  @ManyToOne(() => Posts) //, (p) => p.PostLikes)
  @JoinColumn({ name: 'postId' })
  Posts: Posts;
  @Column('uuid')
  postId: string;
  @Column()
  addedAt: string;
  @ManyToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  Users: Users;
  @Column('uuid')
  userId: string;
  @Column()
  login: string;
  @Column()
  isUserBanned: boolean;
  @Column()
  status: string;
}

@Entity({ name: 'CommentLikes' })
export class CommentLikes {
  @PrimaryGeneratedColumn('uuid')
  commentLikeId: string;
  @OneToOne(() => Comments)
  @JoinColumn({ name: 'commentId' })
  @Column()
  commentId: string;
  @Column()
  addedAt: string;
  @OneToOne(() => Users)
  @JoinColumn({ name: 'userId' })
  Users: Users;
  @Column('uuid')
  userId: string;
  @Column({ nullable: true })
  login: string;
  @Column()
  isUserBanned: boolean;
  @Column()
  status: string;
}

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