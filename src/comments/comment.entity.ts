import { CommentLikes } from '../likes/like.entity';
import { Posts } from '../posts/post.entity';
import { Users } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryColumn,
} from 'typeorm';

@Entity({ name: 'Comments' })
export class Comments {
  @OneToMany(() => CommentLikes, (cl) => cl.Comments)
  @JoinColumn({ name: 'commentId' })
  CommentLikes: CommentLikes[];
  @PrimaryColumn('uuid')
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
