import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CommentsRepository } from '../../../comments/comments.repository';
import { LikesRepository } from '../../../likes/likes.repository';
import { CommentLikeDbType } from '../../../likes/db.likes.types';
import { UsersRepository } from '../../../users/users.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class SetLikeStatusForCommentCommand {
  constructor(
    public userId: string,
    public commentId: string,
    public status: string,
  ) {}
}

@CommandHandler(SetLikeStatusForCommentCommand)
export class SetLikeStatusForCommentUseCase
  implements ICommandHandler<SetLikeStatusForCommentCommand>
{
  constructor(
    private readonly commentRepository: CommentsRepository,
    private readonly likesRepository: LikesRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async execute(
    command: SetLikeStatusForCommentCommand,
  ): Promise<ActionResult | string> {
    const userId = command.userId;
    const commentId = command.commentId;
    const status = command.status;

    const comment = await this.commentRepository.getCommentDbTypeById(
      commentId,
    );
    if (!comment) {
      return ActionResult.CommentNotFound;
    }

    //check is user already liked this comment
    const commentLikeObject = await this.likesRepository.getCommentLikeObject(
      userId,
      commentId,
    );
    //if user never set likestatus, create it
    if (!commentLikeObject) {
      const likerLogin = await this.usersRepository.getUserLoginById(userId);
      if (!likerLogin) {
        return ActionResult.UserNotFound;
      }
      const commentLikeDto = new CommentLikeDbType(
        commentId,
        new Date().toISOString(),
        userId,
        status,
      );
      const isLikeAdded = await this.likesRepository.addCommentLikeStatus(
        commentLikeDto,
      );
      const isLikeCountSet =
        await this.likesRepository.countAndSetCommentLikesAndDislikesForSpecificComment(
          commentId,
        );
      if (isLikeAdded && isLikeCountSet) {
        return ActionResult.Success;
      } else {
        ActionResult.NotSaved;
      }
    }

    if (commentLikeObject.status === status) {
      return ActionResult.NoChangeNeeded;
    }

    const islikeUpdated = await this.likesRepository.updateCommentLike(
      commentId,
      userId,
      status,
    );

    const isLikeCountSet =
      await this.likesRepository.countAndSetCommentLikesAndDislikesForSpecificComment(
        commentId,
      );

    if (islikeUpdated && isLikeCountSet) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
