import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../blogs/infrostracture/blogs.repository';
import { PostsRepository } from '../posts.repository';
import { CheckService } from '../../other.services/check.service';
import { LikesRepository } from '../../likes/likes.repository';
import { PostLikeDbType } from '../../likes/db.likes.types';
import { UsersRepository } from '../../users/users.repository';
import { ActionResult } from '../../helpers/enum.action.result.helper';

export class SetLikeStatusForPostCommand {
  constructor(
    public userId: string,
    public postId: string,
    public status: string,
  ) {}
}

@CommandHandler(SetLikeStatusForPostCommand)
export class SetLikeStatusForPostUseCase
  implements ICommandHandler<SetLikeStatusForPostCommand>
{
  constructor(
    private readonly blogRepository: BlogsRepository,
    private readonly postRepository: PostsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly likesRepository: LikesRepository,
    private readonly checkService: CheckService,
  ) {}

  async execute(
    command: SetLikeStatusForPostCommand,
  ): Promise<ActionResult | string> {
    const userId = command.userId;
    const postId = command.postId;
    const status = command.status;

    const post = await this.postRepository.getPostDBTypeById(postId);
    if (!post) {
      return ActionResult.PostNotFound;
    }

    const blog = await this.blogRepository.getBlogDBTypeById(post.blogId);
    if (!blog) {
      return ActionResult.BlogNotFound;
    }

    const isUserBannedForBlog = await this.checkService.isUserBannedForBlog(
      blog.blogId,
      userId,
    );
    if (isUserBannedForBlog) {
      return ActionResult.UserBannedForBlog;
    }

    //check is user already liked post
    const likeObject = await this.likesRepository.getPostLikeObject(
      userId,
      postId,
    );

    //if user never set likestatus, create it
    if (!likeObject) {
      const likerLogin = await this.usersRepository.getUserLoginById(userId);
      if (!likerLogin) {
        return ActionResult.UserNotFound;
      }
      const postLikeDto = new PostLikeDbType(
        postId,
        new Date().toISOString(),
        userId,
        status,
      );

      const isLikeAdded = await this.likesRepository.addPostLikeStatus(
        postLikeDto,
      );

      const isLikesCountSet =
        await this.likesRepository.countAndSetPostLikesAndDislikesForSpecificPost(
          postId,
        );

      if (isLikeAdded && isLikesCountSet) {
        return ActionResult.Success;
      } else {
        return ActionResult.NotSaved;
      }
    }

    if (likeObject.status === status) {
      return ActionResult.NoChangeNeeded;
    }

    const islikeUpdated = await this.likesRepository.updatePostLike(
      postId,
      userId,
      status,
    );

    const isLikesCountSet =
      await this.likesRepository.countAndSetPostLikesAndDislikesForSpecificPost(
        postId,
      );

    if (islikeUpdated && isLikesCountSet) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
