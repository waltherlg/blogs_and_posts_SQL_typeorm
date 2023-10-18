import { Posts } from "src/posts/posts.types";
import { Users } from "src/users/users.types";
import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class PostLikes {
    @PrimaryGeneratedColumn('uuid')
    postLikeId: string
    @OneToOne(()=>Posts)
    @JoinColumn({name: 'postId'})
    Posts: Posts
    @Column('uuid')
    postId: string;
    @Column()
    addedAt: string;
    @OneToOne(() => Users )
    @JoinColumn({ name: 'userId' })
    Users: Users
    @Column('uuid')
    userId: string;
    @Column()
    login: string;
    @Column()
    isUserBanned: boolean;
    @Column()
    status: string;
}

export class PostLikeDbType {
    constructor(
        public postId: string,
        public addedAt: string,
        public userId: string,
        public login: string,
        public isUserBanned: boolean,
        public status: string,
    ) {}
}

export class CommentLikeDbType {
    constructor(
        public commentId: string,
        public addedAt: string,
        public userId: string,
        public login: string,
        public isUserBanned: boolean,
        public status: string,
    ) {}
}