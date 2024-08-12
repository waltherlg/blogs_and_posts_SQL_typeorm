import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { TelegramAdapter } from '../../../adapters/telegram.adapter';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { Blogs } from '../../blog.entity';
import { BlogSubscribers } from '../../blog.subscriber.types';
import { BlogSubscribersRepository } from '../../infrostracture/blog.subscriber.repository';

export class UserUnsubscribeFromBlogCommand {
  constructor(public userId: string, public blogId: string) {}
}

@CommandHandler(UserUnsubscribeFromBlogCommand)
export class UserUnsubscribeFromBlogUseCase
  implements ICommandHandler<UserUnsubscribeFromBlogCommand>
{
  constructor(
    private readonly blogRepository: BlogsRepository,
    private readonly BlogSubscribersRepository: BlogSubscribersRepository,
  ) {}

  async execute(
    command: UserUnsubscribeFromBlogCommand,
  ): Promise<ActionResult> {
    const userId = command.userId;
    const blogId = command.blogId;
    const blog: Blogs = await this.blogRepository.getBlogDBTypeById(blogId);
    if (!blog) return ActionResult.BlogNotFound;

    let currentSub: BlogSubscribers = blog.BlogSubscribers.find((sub) => sub.userId === userId)
    if(!currentSub){
      return ActionResult.NoChangeNeeded;
    }
    if(currentSub.isSubscribe === false){
      return ActionResult.NoChangeNeeded;
    }

    currentSub.isSubscribe = false

    const isBlogSave = await this.blogRepository.saveBlog(blog);
    if (isBlogSave) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }


    // const result = await this.BlogSubscribersRepository.deleteBlogSubscribe(
    //   blogId,
    //   userId,
    // );

    // if (result) {
    //   return ActionResult.Success;
    // } else {
    //   return ActionResult.NotSaved;
    // }
  }
}
