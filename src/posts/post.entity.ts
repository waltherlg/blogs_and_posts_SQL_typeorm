import { Comments } from '../comments/comment.entity';
import { Blogs } from '../blogs/blog.entity';
import { Users } from '../users/user.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { PostLikes } from '../likes/like.entity';
import { PostMainImage, postMainOutputType } from './post.image.type';
import { PostDBType } from './posts.types';

@Entity({ name: 'Posts' })
export class Posts extends PostDBType {
  @PrimaryColumn('uuid')
  postId: string;
  @Column()
  title: string;
  @Column()
  shortDescription: string;
  @Column()
  content: string;
  @ManyToOne(() => Blogs, (b) => b.Posts, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
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
  @OneToMany(() => Comments, (c) => c.Posts)
  @JoinColumn({ name: 'postId' })
  Comments: Comments[];
  @OneToMany(() => PostLikes, (pl) => pl.Posts)
  @JoinColumn({ name: 'postId' })
  PostLikes: PostLikes[];

  @OneToOne(() => PostMainImage, (i) => i.Posts, { eager: true, cascade: true })
  PostMainImage: PostMainImage | null;

  returnForPublic(){
    const images: {
      main: postMainOutputType[];
    } = {
      main: [],
    };

    if (this.PostMainImage && this.PostMainImage.url !== null) {
      images.main = [
        {
          url: this.PostMainImage.url,
          width: this.PostMainImage.width,
          height: this.PostMainImage.height,
          fileSize: this.PostMainImage.fileSize,
        },
      ];
    }



  }
}
