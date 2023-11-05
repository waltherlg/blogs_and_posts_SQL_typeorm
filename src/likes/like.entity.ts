import { Comments } from '../comments/comment.entity';
import { Posts } from '../posts/post.entity';
import { Users } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

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
//   @Column()
//   login: string;
//   @Column()
//   isUserBanned: boolean;
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