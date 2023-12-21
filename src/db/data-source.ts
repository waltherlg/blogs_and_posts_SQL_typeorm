import { DataSource } from 'typeorm';

// import { Users } from "src/users/user.entity";
// import { UserDevices } from "src/usersDevices/user.device.entity";
// import { Blogs } from "src/blogs/blog.entity";
// import { Posts } from "src/posts/post.entity";
// import { Comments } from "src/comments/comment.entity";
// import { CommentLikes, PostLikes } from "src/likes/like.entity";

import { Users } from '../users/user.entity';
import { UserDevices } from '../usersDevices/user.device.entity';
import { Blogs, BlogBannedUsers } from '../blogs/blog.entity';
import { Posts } from '../posts/post.entity';
import { Comments } from '../comments/comment.entity';
import { CommentLikes, PostLikes } from '../likes/like.entity';
import { Questions } from '../quizGame/quiz.questions.types';
import { QuizAnswers } from '../quizGame/quiz.answers.types';
import { QuizGames } from '../quizGame/quiz.game.types';

export default new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: 5432,
  username: 'nest',
  password: 'nest',
  database: 'blogs_and_posts_typeorm',
  synchronize: false,
  //entities: ["src/**/*.entity{.ts,.js}"],
  entities: [
    Users,
    UserDevices,
    Blogs,
    BlogBannedUsers,
    Posts,
    Comments,
    CommentLikes,
    PostLikes,
    Questions,
    QuizAnswers,
    QuizGames,
    
    
  ],
  //migrations: [ "src/db/migrations/*.ts" ],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'custom_migration_table',
});
