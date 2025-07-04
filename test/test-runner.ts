import { testSaUsersCrud } from './00-0-sa.users.e2e-spec';
import { testSaUsersGetWithPagination } from './00-1-sa.get-users-pagenations.e2e-spec';
import { testSecurityDevices } from './01-01-security-devices.e2e-spec';
import { testAuthOperations } from './03-00-auth.(integration).test';
import { testAuthValidations } from './03-01-auth.validations.e2e-spec';
import { testBloggerCrudOnlyBlogs } from './05-00-blogger.blogs.controller';
import { testPostLikesCrud08 } from './08-post-likes.operation.e2e-spec';
import { testCommentLikesCrud } from './09-comments-likes.operation.e2e-spec';
import { bloggerUsersControllers } from './11-blogger.usrers.controller.e2e-spec';
import { saBlogsControllerCrudAndBan } from './06-sa.blogs.controller.e2e-spec';
import { testBanUserForBlogByBlogger } from './05-01-blogger.users.ban.check-e2e-spec';
import { postCrudOperationsByBlogger07 } from './07-00-post.CRUD.e2e-spec';
import { commentCrudOperations } from './09-00-public.comments.controller.e2e-spec copy';
import { saCommentCrudOperations } from './09-00-sa-and-public.comments.controller.e2e-spec copy 2';
import { onlyCommentLikesCrud13 } from './13-only-comments-likes.e2e-spec copy';
import { commentPaginationTest14 } from './14-00-comments.pagination.e2e-spec';
import { commentLikesWithUserBanCrud1301 } from './13-01-comments-likes.with.user.bane2e-spec copy 2';
import { questionCrudOperationsSa15 } from './15-00-sa.question.crud.operations.e2e-spec';
import { quizGameCrudOperationsSa16 } from './16-00-sa.quiz.game.crud.operations.e2e-spec';
import { quizGameCrudOperationsSa1601 } from './16-01-sa.quiz.game.crud.operations.e2e-spec';
import { quizGameStatisticOperations17 } from './17-00-quiz.game.statistic.operations.e2e-spec';
import { onlyQuizGameCreateSa1602 } from './16-02-only.quiz.game.create.e2e-spec copy';
import { testBloggerPaginationTest0502 } from './05-02-blogger.blogs.pagination.check-e2e-spec';
import { banCheckOperation } from './10-ban.check.operation.e2e-spec';
import { testBloggerImageOperation18 } from './18-00-blogger.image.operations-e2e-spec';
import { userSubscribeBlogTest_19 } from './19-00-user.subscribe.blog.e2e-spec';

describe('End-to-End Tests', () => {
  testSaUsersCrud();
  testSaUsersGetWithPagination();
  testSecurityDevices();
  testAuthOperations();
  testAuthValidations();
  testBloggerCrudOnlyBlogs();
  testBanUserForBlogByBlogger();
  testBloggerPaginationTest0502();
  saBlogsControllerCrudAndBan();
  postCrudOperationsByBlogger07();
  testPostLikesCrud08();
  commentCrudOperations(); // this comment CRUD if blog create blogger
  saCommentCrudOperations();
  testCommentLikesCrud();
  banCheckOperation(); //like check
  commentPaginationTest14();
  onlyCommentLikesCrud13(); // только для проверки создания лайка для комментария
  commentLikesWithUserBanCrud1301();
  bloggerUsersControllers();
  questionCrudOperationsSa15();
  quizGameCrudOperationsSa16();
  quizGameCrudOperationsSa1601();
  onlyQuizGameCreateSa1602();
  quizGameStatisticOperations17();
  testBloggerImageOperation18();
  userSubscribeBlogTest_19();
});
