
import { Posts } from 'src/posts/post.entity';
import { Users } from 'src/users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';


@Entity({ name: 'Blogs' })
export class Blogs {
  @PrimaryColumn('uuid')
  blogId: string;
  @Column()
  name: string;
  @Column()
  isBlogBanned: boolean;
  @Column({ nullable: true })
  blogBanDate: string | null;
  // @OneToOne(() => Users )
  // Users: Users
  @Column({ type: 'uuid', nullable: true })
  userId: string | null;
  @Column()
  description: string;
  @Column()
  websiteUrl: string;
  @Column()
  createdAt: string;
  @Column()
  isMembership: boolean;
  @OneToMany(() => BlogBannedUsers, (b) => b.Blogs)
  BlogBannedUsers: BlogBannedUsers[];
  @OneToMany(() => Posts, (p) => p.Blogs, { cascade: ['remove'] })
  Posts: Posts[]
}

@Entity({ name: 'BlogBannedUsers' })
export class BlogBannedUsers {
  @PrimaryGeneratedColumn('uuid')
  banId: string;
  @ManyToOne(() => Blogs, (b) => b.BlogBannedUsers)
  @JoinColumn({ name: 'blogId' })
  Blogs: Blogs;
  @Column('uuid')
  blogId: string;
  @ManyToOne(() => Users, (u) => u.BlogBannedUsers)
  @JoinColumn({ name: 'userId' })
  Users: Users;
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @Column()
  banDate: string;
  @Column()
  banReason: string;
}