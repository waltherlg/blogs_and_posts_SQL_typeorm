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
    if (
      !(await this.checkService.isUserOwnerOfBlog(
        command.userId,
        command.blogId,
      ))
    ) {
      return ActionResult.NotOwner;
    }

    const userId = command.userId;
    const blogId = command.blogId;
    const buffer = command.blogWallpaperFile.buffer;
    const metadata = command.metadata;

    try {
      const uploadedWallpaperKey =
        await this.s3StorageAdapter.saveBlogWallpaper(
          userId,
          blogId,
          buffer,
          metadata,
        );

      const wallpaper = {
        url: uploadedWallpaperKey,
        width: command.metadata.width,
        height: command.metadata.height,
        fileSize: command.metadata.size,
      };

      const main = [];
      const mainObj = {};
      const blogsMainImage = await this.s3StorageAdapter.getBlogMainMetadata(
        userId,
        blogId,
      );
      
      {
        if (blogsMainImage) {
          const mainObj = {
            url: blogsMainImage.Key,
            width: blogsMainImage.width,
            height: blogsMainImage.height,
            fileSize: blogsMainImage.size,
          };
          main.push(mainObj);
        }
      }
      return { wallpaper, main };
    } catch (error) {
      return ActionResult.NotCreated;
    }
  }
}
