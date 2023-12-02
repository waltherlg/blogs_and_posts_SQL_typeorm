import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { CommandHandler } from '@nestjs/cqrs/dist/decorators';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { BanBlogInputModelType } from '../../../blogs/api/sa.blogs.controller';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class SaBanBlogCommand {
  constructor(
    public blogId: string,
    public banBlogDto: BanBlogInputModelType,
  ) {}
}

@CommandHandler(SaBanBlogCommand)
export class SaBanBlogUseCase implements ICommandHandler<SaBanBlogCommand> {
  constructor(private readonly blogsRepository: BlogsRepository) {}

  async execute(command: SaBanBlogCommand): Promise<ActionResult> {
    const blogId = command.blogId;
    const newBanStatus = command.banBlogDto.isBanned;

    const blog = await this.blogsRepository.getBlogDBTypeById(blogId);
    if (!blog) return ActionResult.BlogNotFound;

    if (blog.isBlogBanned === newBanStatus) {
      return ActionResult.NoChangeNeeded;
    }

    blog.isBlogBanned = newBanStatus;
    let blogBanDate;

    if (newBanStatus === true) {
      blogBanDate = new Date().toISOString();
    } else {
      blogBanDate = null;
    }

    const isBlogSave = await this.blogsRepository.newBanStatus(
      blogId,
      newBanStatus,
      blogBanDate,
    );

    if (isBlogSave) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
