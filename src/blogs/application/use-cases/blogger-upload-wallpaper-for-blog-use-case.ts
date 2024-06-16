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
const sharp = require('sharp');

//TODO: in progress
export class BloggerUploadWallpaperForBlogCommand {
  constructor(
    public userId,
    public blogId,
    public blogWallpaperFile) {}
}

@CommandHandler(BloggerUploadWallpaperForBlogCommand)
export class BloggerUploadWallpaperForBlogUseCase
  implements ICommandHandler<BloggerUploadWallpaperForBlogCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly s3StorageAdapter: S3StorageAdapter,
    private readonly checkService: CheckService
  ) {}
  async execute(
    command: BloggerUploadWallpaperForBlogCommand,
  ) {

    if(!await this.checkService.isUserOwnerOfBlog(command.userId, command.blogId)){
      return ActionResult.NotOwner
    }

    const uploadResultKey = await this.s3StorageAdapter.saveBlogWallpaper(
      command.userId, 
      command.blogId, 
      command.blogWallpaperFile.buffer)

      const metadata = await sharp(command.blogWallpaperFile.buffer).metadata();
      console.log(" metadata in use case ", metadata);
      

    const imageMetadata = await this.s3StorageAdapter.getObjectMetadata(uploadResultKey)
    console.log('imageMetadata ', imageMetadata);
    
    
    return uploadResultKey;
  }
}
