
import { Posts } from '../posts/post.entity';
import { Users } from '../users/user.entity';
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
  @ManyToMany(() => BlogBannedUsers, (b) => b.Blogs)
  @JoinColumn({name: 'blogId'})
  BlogBannedUsers: BlogBannedUsers[];
  @OneToMany(() => Posts, (p) => p.Blogs, { cascade: ['remove'] })
  @JoinColumn({name: 'blogId'})
  Posts: Posts[]
}

@Entity({ name: 'BlogBannedUsers' })
export class BlogBannedUsers {
  @PrimaryGeneratedColumn('uuid')
  banId: string;
  @ManyToMany(() => Blogs, (b) => b.BlogBannedUsers)
  @JoinColumn({ name: 'blogId' })
  Blogs: Blogs[];
  @Column('uuid')
  blogId: string;
  @ManyToMany(() => Users, (u) => u.BlogBannedUsers)
  @JoinColumn({ name: 'RelationsBlogBannedUsersTable' })
  Users: Users;
  // @ManyToMany(() => Users, (u) => u.BlogBannedUsers)
  // @JoinColumn({ name: 'userId' })
  // Users: Users;
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @Column()
  banDate: string;
  @Column()
  banReason: string;
}

@Entity({ name: 'RelationsBlogBannedUsersTable' })
export class RelationsBlogBannedUsersTable {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Users, (u) => u.BlogBannedUsers)
  User: Users;

  @ManyToOne(() => BlogBannedUsers, (b) => b.Users)
  BlogBannedUsers: BlogBannedUsers;
}