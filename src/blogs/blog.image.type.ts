
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Blogs } from './blog.entity';

export class BlogWallpaperImageDto{
  constructor(
    public blogId: string,
    public url: string | null = null,
    public width: number | null = null,
    public height: number | null = null,
    public fileSize: number | null = null,
  ){}
}

@Entity({name: 'BlogWallpaperImage'})
export class BlogWallpaperImage extends BlogWallpaperImageDto{
  @PrimaryGeneratedColumn('uuid')
  imageId: string;
  @OneToOne(() => Blogs, (blog) => blog.BlogWallpaperImage, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'blogId'})
  Blogs: Blogs
  @Column({ type: 'uuid' })
  blogId: string
  @Column({ nullable: true })
  url: string | null;
  @Column({ nullable: true })
  width: number | null
  @Column({ nullable: true })
  height: number | null
  @Column({ nullable: true })
  fileSize: number | null
}

export class BlogMainImageDto{
  constructor(
    public blogId: string,
    public url: string | null = null,
    public width: number | null = null,
    public height: number | null = null,
    public fileSize: number | null = null,
  ){}
}

@Entity({name: 'BlogMainImage'})
export class BlogMainImage extends BlogMainImageDto{
  @PrimaryGeneratedColumn('uuid')
  imageId: string;
  @OneToOne(() => Blogs, (blog) => blog.BlogMainImage, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'blogId'})
  Blogs: Blogs
  @Column({ type: 'uuid' })
  blogId: string
  @Column({ nullable: true })
  url: string | null;
  @Column({ nullable: true })
  width: number | null
  @Column({ nullable: true })
  height: number | null
  @Column({ nullable: true })
  fileSize: number | null
}