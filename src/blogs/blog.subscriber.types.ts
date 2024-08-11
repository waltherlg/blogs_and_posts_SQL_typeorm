import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Blogs } from './blog.entity';
import { Users } from '../users/user.entity';

export class BlogSubscriberDto {
  constructor(
    public blogId: string,
    public userId: string,
    public isSubscribe: boolean = true,
    public subscribeData: Date = new Date(),
  ) {}
}

@Entity({ name: 'BlogSubscribers' })
export class BlogSubscribers extends BlogSubscriberDto {
  @PrimaryGeneratedColumn('uuid')
  blogSubscriberId: string;
  @ManyToOne(() => Blogs, (blog) => blog.BlogSubscribers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'blogId' })
  Blogs: Blogs;
  @Column({ type: 'uuid' })
  blogId: string;

  @ManyToOne(() => Users, (user) => user.BlogSubscribers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  Users: Users;
  @Column({ type: 'uuid' })
  userId: string;

  @Column()
  isSubscribe: boolean

  @Column({ type: 'timestamptz' })
  subscribeData: Date;
}
