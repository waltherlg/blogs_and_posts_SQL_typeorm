import { Blogs } from 'src/blogs/blogs.types';
import { Users } from 'src/users/users.types';
import { Column, Entity, JoinColumn, ManyToOne, PrimaryColumn } from 'typeorm';

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
  @ManyToOne(() => Blogs)
  @JoinColumn({ name: 'blogId' })
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
