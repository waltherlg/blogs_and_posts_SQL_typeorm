import { Comments } from 'src/comments/comments.types';
import { Blogs } from '../blogs/blogs.types';
import { Users } from '../users/users.types';
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn } from 'typeorm';
import { PostLikes } from 'src/likes/db.likes.types';

@Entity({ name: 'Posts' })
export class Posts {
  @PrimaryColumn('uuid')
  postId: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @ManyToOne(() => Blogs, (b) => b.Posts)
  @JoinColumn({name: 'blogId'})
  Blogs: Blogs;
  @Column('uuid')
  blogId: string;
  @Column()
  createdAt: string;
  @Column({ type: 'uuid', nullable: true })
  userId: string;
  @Column()
  likesCount: number;
  @Column()
  dislikesCount: number;
  @OneToMany(() => Comments, (c) => c.Posts)
  @JoinColumn({name: 'postId'})
  Comments: Comments[]
  @OneToMany(() => PostLikes, (pl) => pl.Posts )
  @JoinColumn({name: 'postId'})
  PostLikes: PostLikes[]
}