import { BlogDBType } from '../../blogs.types';
import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { CreateBlogInputModelType } from '../../api/public.blogs.controller';
import { CommandHandler } from '@nestjs/cqrs/dist';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { UsersRepository } from '../../../users/users.repository';
import { v4 as uuidv4 } from 'uuid';
import { S3StorageAdapter } from '../../../adapters/file-storage-adapter';
import { CheckService } from '../../../other.services/check.service';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { url } from 'inspector';
import { Blogs } from '../../blog.entity';
const sharp = require('sharp');

export class BloggerUploadWallpaperForBlogCommand {
  constructor(
    public userId,
    public blogId,
    public blogWallpaperFile,
    public metadata,
  ) {}
}

@CommandHandler(BloggerUploadWallpaperForBlogCommand)
export class BloggerUploadWallpaperForBlogUseCase
  implements ICommandHandler<BloggerUploadWallpaperForBlogCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly s3StorageAdapter: S3StorageAdapter,
    private readonly checkService: CheckService,
  ) {}
  async execute(command: BloggerUploadWallpaperForBlogCommand) {
    const userId = command.userId;
    const blogId = command.blogId;
    const buffer = command.blogWallpaperFile.buffer;
    const metadata = command.metadata;

    const blog: Blogs = await this.blogsRepository.getBlogDBTypeById(blogId);
    if (!blog) return ActionResult.BlogNotFound;
    if (blog.userId !== userId) return ActionResult.NotOwner;

    try {
      const uploadedWallpaperKey =
        await this.s3StorageAdapter.saveBlogWallpaper(
          userId,
          blogId,
          buffer,
          metadata,
        );

      blog.BlogWallpaperImage.url = uploadedWallpaperKey;
      blog.BlogWallpaperImage.width = command.metadata.width;
      blog.BlogWallpaperImage.height = command.metadata.height;
      blog.BlogWallpaperImage.fileSize = command.metadata.size;

      const saveBlogResult = await this.blogsRepository.saveBlog(blog);
      if (saveBlogResult) {
        const images = blog.returnForPublic().images;
        return images;
      } else {
        return ActionResult.NotCreated;
      }
    } catch (error) {
      return ActionResult.NotCreated;
    }
  }
}
