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
import { BlogMainImage, BlogWallpaperImage } from './blog.image.type';

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

  @ManyToOne(() => Users, (u) => u.Blogs, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  Users: Users;
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
  @JoinColumn({ name: 'blogId' })
  BlogBannedUsers: BlogBannedUsers[];
  @OneToMany(() => Posts, (p) => p.Blogs)
  Posts: Posts[];

  @OneToOne(() => BlogWallpaperImage, (i) => i.Blogs, {eager: true})
  BlogWallpaperImage: BlogWallpaperImage | null;
  
  @OneToOne(() => BlogMainImage, (i) => i.Blogs, {eager: true})
  BlogMainImage: BlogMainImage | null;

  returnForPublic(){

    let images: {
      wallpaper: null,
      main: []
    }

    if(this.BlogWallpaperImage && this.BlogWallpaperImage.url !== null){
      //images.wallpaper = 
    }


    return {
    id: this.blogId,
    name: this.name,
    description: this.description,
    websiteUrl: this.websiteUrl,
    createdAt: this.createdAt,
    isMembership: this.isMembership,
    }

  }
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

  @ManyToOne(() => Users, (u) => u.BlogBannedUsers) // рабочая
  @JoinColumn({ name: 'userId' })
  Users: Users;

  @Column({ type: 'uuid' })
  userId: string;
  @Column()
  banDate: string;
  @Column()
  banReason: string;
}


