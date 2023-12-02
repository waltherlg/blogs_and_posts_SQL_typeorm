import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../../blogs/infrostracture/blogs.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class SaDeleteBlogByIdFromUriCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(SaDeleteBlogByIdFromUriCommand)
export class SaDeleteBlogByIdFromUriUseCase
  implements ICommandHandler<SaDeleteBlogByIdFromUriCommand>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(
    command: SaDeleteBlogByIdFromUriCommand,
  ): Promise<ActionResult> {
    const blog = await this.blogsRepository.getBlogDBTypeById(command.blogId);
    if (!blog) return ActionResult.BlogNotFound;
    const result = await this.blogsRepository.deleteBlogById(command.blogId);
    if (result) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
