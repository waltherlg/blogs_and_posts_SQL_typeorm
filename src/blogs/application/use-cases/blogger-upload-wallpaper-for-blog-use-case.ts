import { BlogDBType } from '../../blogs.types';
import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { CreateBlogInputModelType } from '../../api/public.blogs.controller';
import { CommandHandler } from '@nestjs/cqrs/dist';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { UsersRepository } from '../../../users/users.repository';
import { v4 as uuidv4 } from 'uuid';

//TODO: in progress
export class BloggerUploadWallpaperForBlogCommand {
  constructor(
    public userId,
  ) {}
}


@CommandHandler(BloggerUploadWallpaperForBlogCommand)
export class BloggerUploadWallpaperForBlogUseCase implements ICommandHandler<BloggerUploadWallpaperForBlogCommand> {
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}
  async execute(command: BloggerUploadWallpaperForBlogCommand): Promise<string> {
    return 'result'

  }
}
