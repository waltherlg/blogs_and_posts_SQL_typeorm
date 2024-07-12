import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Posts } from './post.entity';

export type postMainOutputType =
  | {
      url: string;
      width: number;
      height: number;
      fileSize: number;
    }
  | [];

export class PostMainImageDto {
  constructor(
    public postId: string,
    public url: string | null = null,
    public width: number | null = null,
    public height: number | null = null,
    public fileSize: number | null = null,
    public urlMiddle: string | null = null,
    public widthMiddle: number | null = null,
    public heightMiddle: number | null = null,
    public fileSizeMiddle: number | null = null,
    public urlSmall: string | null = null,
    public widthSmall: number | null = null,
    public heightSmall: number | null = null,
    public fileSizeSmall: number | null = null,
  ) {}
}

@Entity({ name: 'PostMainImage' })
export class PostMainImage extends PostMainImageDto {
  @PrimaryGeneratedColumn('uuid')
  imageId: string;
  @OneToOne(() => Posts, (post) => post.PostMainImage, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'postId' })
  Posts: Posts;
  @Column({ type: 'uuid' })
  postId: string;
  @Column({ nullable: true })
  url: string | null;
  @Column({ nullable: true })
  width: number | null;
  @Column({ nullable: true })
  height: number | null;
  @Column({ nullable: true })
  fileSize: number | null;
  @Column({ nullable: true })
  urlMiddle: string | null;
  @Column({ nullable: true })
  widthMiddle: number | null;
  @Column({ nullable: true })
  heightMiddle: number | null;
  @Column({ nullable: true })
  fileSizeMiddle: number | null;
  @Column({ nullable: true })
  urlSmall: string | null;
  @Column({ nullable: true })
  widthSmall: number | null;
  @Column({ nullable: true })
  heightSmall: number | null;
  @Column({ nullable: true })
  fileSizeSmall: number | null;
}
