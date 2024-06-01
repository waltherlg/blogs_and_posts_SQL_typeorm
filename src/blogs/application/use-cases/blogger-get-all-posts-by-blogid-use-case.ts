import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/infrostracture/blogs.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import {
  PaginationOutputModel,
  RequestBlogsQueryModel,
} from '../../../models/types';
import { PostsRepository } from '../../../posts/posts.repository';
import { PostsQueryRepository } from '../../../posts/posts.query.repository';
import { PostTypeOutput } from '../../../posts/posts.types';

export class BloggerGetAllPostsByBlogIdCommand {
  constructor(
    public blogId: string,
    public userId: string,
    public mergedQueryParams: RequestBlogsQueryModel,
  ) {}
}

@CommandHandler(BloggerGetAllPostsByBlogIdCommand)
export class BloggerGetAllPostsByBlogIdUseCase
  implements ICommandHandler<BloggerGetAllPostsByBlogIdCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly postsRepository: PostsQueryRepository,
  ) {}

  async execute(
    command: BloggerGetAllPostsByBlogIdCommand,
  ): Promise<ActionResult | PaginationOutputModel<PostTypeOutput>> {
    const blog = await this.blogsRepository.getBlogDBTypeById(command.blogId);
    if (!blog) return ActionResult.BlogNotFound;
    if (blog.userId !== command.userId) return ActionResult.NotOwner;
    const result = await this.postsRepository.getAllPostsByBlogsId(
      command.mergedQueryParams,
      command.blogId,
      command.userId,
    );
    return result;
  }
}
