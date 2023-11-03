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

export class PostDBType {
  constructor(
    public postId: string,
    public title: string,
    public shortDescription: string,
    public content: string,
    public blogId: string,
    public createdAt: string,
    public userId: string,
    public likesCount: number,
    public dislikesCount: number,
  ) {}
}

export type PostTypeOutput = {
  id: string;
  title: string;
  shortDescription: string;
  content: string;
  blogId: string;
  blogName: string;
  createdAt: string;
  extendedLikesInfo: extendedLikesInfoType;
};

type extendedLikesInfoType = {
  likesCount: number;
  dislikesCount: number;
  myStatus: string;
  newestLikes: Array<newestLikesOutputType>;
};

type newestLikesOutputType = {
  addedAt: string;
  login: string;
  userId: string;
};
