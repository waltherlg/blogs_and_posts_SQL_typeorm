import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { CommandHandler } from '@nestjs/cqrs/dist/decorators';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { BanUserForBlogInputModelType } from '../../../blogs/api/blogger.blogs.controller';
import { BannedBlogUsersType } from '../../../blogs/blogs.types';
import { UsersRepository } from '../../../users/users.repository';
import { CheckService } from '../../../other.services/check.service';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class BanUserForSpecificBlogCommand {
  constructor(
    public bloggerId: string,
    public userId: string,
    public banUserDto: BanUserForBlogInputModelType,
  ) {}
}

@CommandHandler(BanUserForSpecificBlogCommand)
export class BanUserForSpecificBlogUseCase
  implements ICommandHandler<BanUserForSpecificBlogCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly checkService: CheckService,
  ) {}

  async execute(command: BanUserForSpecificBlogCommand): Promise<ActionResult> {
    const bloggerId = command.bloggerId;
    const userId = command.userId;
    const banStatus = command.banUserDto.isBanned;
    const banReason = command.banUserDto.banReason;
    const blogId = command.banUserDto.blogId;

    const blog = await this.blogsRepository.getBlogDBTypeById(blogId);

    if (!blog) return ActionResult.BlogNotFound;

    if (blog.userId !== bloggerId) return ActionResult.NotOwner;

    const user = await this.usersRepository.getUserDBTypeById(userId);
    if (!user) {
      return ActionResult.UserNotFound;
    }

    if (banStatus === true) {
      if (await this.checkService.isUserBannedForBlog(blogId, userId)) {
        return ActionResult.UserAlreadyBanned;
      }

      const banUserInfo: BannedBlogUsersType = {
        blogId: blogId,
        userId: userId,
        banDate: new Date().toISOString(),
        banReason: banReason,
      };

      const result = await this.blogsRepository.addUserToBlogBanList(
        banUserInfo,
      );
      if (result) {
        return ActionResult.Success;
      } else {
        return ActionResult.NotSaved;
      }
    }

    if (banStatus === false) {
      if (!(await this.checkService.isUserBannedForBlog(blogId, userId))) {
        return ActionResult.UserNotBanned;
      }
      const result = await this.blogsRepository.removeUserFromBlogBanList(
        blogId,
        userId,
      );
      if (result) {
        return ActionResult.Success;
      } else {
        return ActionResult.NotSaved;
      }
    }
  }
}
