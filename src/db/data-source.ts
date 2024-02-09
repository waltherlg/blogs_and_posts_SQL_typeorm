import { DataSource } from 'typeorm';

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
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
  migrationsTableName: 'custom_migration_table',
});
