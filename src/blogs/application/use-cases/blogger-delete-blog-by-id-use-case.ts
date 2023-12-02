import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/infrostracture/blogs.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class DeleteBlogByIdFromUriCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(DeleteBlogByIdFromUriCommand)
export class DeleteBlogByIdFromUriUseCase
  implements ICommandHandler<DeleteBlogByIdFromUriCommand>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(
    command: DeleteBlogByIdFromUriCommand,
  ): Promise<ActionResult> {
    const blog = await this.blogsRepository.getBlogDBTypeById(command.blogId);
    if (!blog) return ActionResult.BlogNotFound;
    if (blog.userId !== command.userId) return ActionResult.NotOwner;
    const result = await this.blogsRepository.deleteBlogById(command.blogId);
    if (result) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
