import { ForbiddenException } from '@nestjs/common';
import {
  CustomNotFoundException,
  CustomisableException,
} from '../exceptions/custom.exceptions';

export enum ActionResult {
  Success = 'SUCCESS',
  BlogNotFound = 'BLOG_NOT_FOUND',
  UserNotFound = 'USER_NOT_FOUND',
  PostNotFound = 'POST_NOT_FOUND',
  QuestionNotFound = 'QUESTION_NOT_FOUND',
  CommentNotFound = 'COMMENT_NOT_FOUND',
  UserAlreadyBanned = 'USER_ALREADY_BANNED',
  UserNotBanned = 'USER_NOT_BANNED',
  UserBannedForBlog = 'USER_BANNED_FOR_BLOG',
  UserAlreadyBound = 'USER_ALREADY_BOUND',
  NotEnoughQuestions = 'NOT_ENOUGH_QUESTIONS',
  UserAlreadyHasUnfinishedGame = 'USER_ALREADY_HAS_UNFINISHED_GAME',
  NoChangeNeeded = 'NO_CHANGE_NEEDED',
  NotOwner = 'CURRENT_USER_IS_NOT_OWNER',
  NotSaved = 'CHANGES_NOT_SAVED',
  NotCreated = 'NOT_CREATED',
  NotDeleted = 'NOT_DELETED',
}

export function handleActionResult(result: ActionResult) {
  if (!Object.values(ActionResult).includes(result)) {
    return;
  }
  switch (result) {
    case ActionResult.Success:
      break;
    case ActionResult.NoChangeNeeded:
      break;
    case ActionResult.UserAlreadyBanned:
      break;
    case ActionResult.UserNotBanned:
      break;
    case ActionResult.BlogNotFound:
      throw new CustomNotFoundException('blog');
    case ActionResult.PostNotFound:
      throw new CustomNotFoundException('post');
    case ActionResult.UserNotFound:
      throw new CustomNotFoundException('user');
    case ActionResult.CommentNotFound:
      throw new CustomNotFoundException('comment');
    case ActionResult.QuestionNotFound:
      throw new CustomNotFoundException('question');

    case ActionResult.NotOwner:
      throw new CustomisableException(
        'not owner',
        'users cannot change data unless they are the owner',
        403,
      );

    case ActionResult.NotEnoughQuestions:
      throw new CustomisableException(
        "can't create game",
        'Not enough questions for create new quiz game',
        418,
      );

    case ActionResult.UserBannedForBlog:
      throw new ForbiddenException("banned user can't add comment");
    case ActionResult.UserAlreadyBound:
      throw new CustomisableException(
        'blogId',
        'current blog already bound',
        400,
      );

    case ActionResult.UserAlreadyHasUnfinishedGame:
      throw new CustomisableException(
        'user',
        'The user is already participating in an unfinished game',
        403
      )

    case ActionResult.NotCreated:
      throw new CustomisableException(
        "can't create",
        'failed to create new doccument',
        500,
      );
    case ActionResult.NotSaved:
      throw new CustomisableException(
        "can't save",
        'failed to save changes',
        500,
      );
    case ActionResult.NotDeleted:
      throw new CustomisableException("can't delete", 'failed to delete', 500);

    default:
      throw new CustomisableException(
        'unexpected',
        'An unexpected error occurred',
        400,
      );
  }
}
