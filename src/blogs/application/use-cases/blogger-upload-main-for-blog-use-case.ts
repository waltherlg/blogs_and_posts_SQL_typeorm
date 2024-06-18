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

export class BloggerUploadMainForBlogCommand {
  constructor(
    public userId,
    public blogId,
    public blogMainFile,
    public metadata) {}
}

@CommandHandler(BloggerUploadMainForBlogCommand)
export class BloggerUploadMainForBlogUseCase
  implements ICommandHandler<BloggerUploadMainForBlogCommand>
{
  constructor(
    private readonly blogsRepository: BlogsRepository,
    private readonly usersRepository: UsersRepository,
    private readonly s3StorageAdapter: S3StorageAdapter,
    private readonly checkService: CheckService
  ) {}
  async execute(
    command: BloggerUploadMainForBlogCommand,
  ) {

    if(!await this.checkService.isUserOwnerOfBlog(command.userId, command.blogId)){
      return ActionResult.NotOwner
    }

    const userId = command.userId
    const blogId = command.blogId 
    const buffer = command.blogMainFile.buffer
    const metadata = command.metadata

  }
}
