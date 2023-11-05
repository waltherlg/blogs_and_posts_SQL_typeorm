import { DataSource } from "typeorm";
import { Users } from "../users/user.entity";
import { UserDevices } from "../usersDevices/user.device.entity";
import { Blogs } from "../blogs/blog.entity";
import { Posts } from "../posts/post.entity";
import { Comments } from "../comments/comment.entity";
import { CommentLikes, PostLikes } from "../likes/like.entity";

export default new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'nest',
        password: 'nest',
        database: 'blogs_and_posts_typeorm',
        synchronize: false,
        entities: [Users, UserDevices, Blogs, Posts, Comments, PostLikes, CommentLikes]
      }
)