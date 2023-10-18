import { Users } from "../users/users.types";
import { Column, Entity, JoinColumn, ManyToOne, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm"

@Entity({name: 'Blogs'})
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
    // @JoinColumn({ name: 'userId' })
    // Users: Users
    @Column({type: 'uuid', nullable: true})
    userId: string | null;
    @Column()
    description: string;
    @Column()
    websiteUrl: string;
    @Column()
    createdAt: string;
    @Column()
    isMembership: boolean;  
}

export class BlogDBType {
  constructor(
    public blogId: string,
    public name: string,
    public isBlogBanned: boolean,
    public blogBanDate: string | null,
    public userId: string | null,
    public description: string,
    public websiteUrl: string,
    public createdAt: string,
    public isMembership: boolean,    
  ) {}
}

@Entity({name: 'BlogBannedUsers' })
export class BlogBannedUsers {
  @PrimaryGeneratedColumn('uuid')
  banId: string
  @ManyToOne(() => Blogs)
  @JoinColumn({ name: 'blogId'})
  Blogs: Blogs
  @Column('uuid')
  blogId: string;
  @ManyToOne(() => Users )
  @JoinColumn({ name: 'userId' })
  Users: Users
  @Column({type: 'uuid', nullable: true})
  bannedUserId: string;
  @Column()
  banDate: string;
  @Column()
  banReason: string;
}

export type BannedBlogUsersType = {
  blogId: string,
  bannedUserId: string,
  banDate: string;
  banReason: string;
}

export type BlogTypeOutput = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
};

export type blogSaTypeOutput = {
  id: string;
  name: string;
  description: string;
  websiteUrl: string;
  createdAt: string;
  isMembership: boolean;
  blogOwnerInfo: blogOwnerInfoType;
  banInfo: blogBanInfoType;
};

type blogOwnerInfoType = {
  userId: string,
  userLogin: string,
};
type blogBanInfoType = {
  isBanned: string,
  banDate: string,
}


