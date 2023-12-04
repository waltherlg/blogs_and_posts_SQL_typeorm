import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { CommandHandler } from '@nestjs/cqrs/dist';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class BindBlogWithUserCommand {
  constructor(public blogId: string, public userId: string) {}
}

@CommandHandler(BindBlogWithUserCommand)
export class BindBlogWithUserUseCase
  implements ICommandHandler<BindBlogWithUserCommand>
{
  constructor(private readonly blogsRepository: BlogsRepository) {}
  async execute(command: BindBlogWithUserCommand): Promise<ActionResult> {
    const blog = await this.blogsRepository.getBlogDBTypeById(command.blogId);

    if (!blog) return ActionResult.BlogNotFound;

    if (blog.userId !== null) return ActionResult.UserAlreadyBound;

    //заглушка
    const result = await this.blogsRepository.bindBlogWithUser(
      command.blogId,
      command.userId,
    );
    if (result) {
      return ActionResult.Success; 
    } else {
      return ActionResult.NotSaved;
    }
  }
}
