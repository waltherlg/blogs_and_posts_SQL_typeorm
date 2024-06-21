
import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
import { Blogs } from './blog.entity';

@Entity({name: 'BlogWallpaperImage'})
export class BlogWallpaperImage{
  @PrimaryGeneratedColumn('uuid')
  imageId: string;
  @OneToOne(() => Blogs, (blog) => blog.BlogWallpaperImage, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'blogId'})
  Blogs: Blogs
  @Column({ type: 'uuid' })
  blogId: string
  @Column()
  url: string | null;
  @Column()
  width: number | null
  @Column()
  height: number | null
  @Column()
  fileSize: number | null
}

@Entity({name: 'BlogMainImage'})
export class BlogMainImage{
  @PrimaryGeneratedColumn('uuid')
  imageId: string;
  @OneToOne(() => Blogs, (blog) => blog.BlogMainImage, { onDelete: 'CASCADE' })
  @JoinColumn({name: 'blogId'})
  Blogs: Blogs
  @Column({ type: 'uuid' })
  blogId: string
  @Column()
  url: string | null;
  @Column()
  width: number | null
  @Column()
  height: number | null
  @Column()
  fileSize: number | null
}