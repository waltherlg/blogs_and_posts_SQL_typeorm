import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { TelegramAdapter } from '../../../adapters/telegram.adapter';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { Blogs } from '../../blog.entity';
import { BlogSubscribers } from '../../blog.subscriber.types';

export class UserSubscribeBlogCommand {
  constructor(
    public userId: string, 
    public blogId: string) {}
}

@CommandHandler(UserSubscribeBlogCommand)
export class UserSubscribeBlogCase
  implements ICommandHandler<UserSubscribeBlogCommand>
{
  constructor(
    private readonly blogRepository: BlogsRepository,
  ) {}

  async execute(command: UserSubscribeBlogCommand): Promise<ActionResult> {
    const userId = command.userId
    const blogId = command.blogId
    const blog: Blogs = await this.blogRepository.getBlogDBTypeById(blogId)
    if(!blog) return ActionResult.BlogNotFound
    //console.log('blog in subscribe useCase ', blog);
    console.log('current blog subscribers ', blog.BlogSubscribers);
    if(blog.BlogSubscribers.some(sub => sub.userId === userId)){
      console.log('already sub ');
      return ActionResult.NoChangeNeeded
    } 

    const subscriber: BlogSubscribers = new BlogSubscribers(blogId, userId)
    blog.BlogSubscribers.push(subscriber)
    console.log('current blog subscribers after subscribe ', blog.BlogSubscribers);

    const isBlogSave = await this.blogRepository.saveBlog(blog)
    if(isBlogSave) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved
    }
    
  }
}
