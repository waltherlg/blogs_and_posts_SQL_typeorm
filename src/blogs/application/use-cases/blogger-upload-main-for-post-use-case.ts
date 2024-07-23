import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import {
  PostMainSizeEnum,
  S3StorageAdapter,
} from '../../../adapters/file-storage-adapter';
import { CheckService } from '../../../other.services/check.service';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { PostsRepository } from '../../../posts/posts.repository';
import { Posts } from '../../../posts/post.entity';
import { fullImageUrl } from '../../../helpers/helpers.functions';
import sharp from 'sharp';

export class BloggerUploadMainForPostCommand {
  constructor(
    public userId,
    public blogId,
    public postId,
    public postMainFile,
    public metadata,
  ) {}
}

@CommandHandler(BloggerUploadMainForPostCommand)
export class BloggerUploadMainForPostUseCase
  implements ICommandHandler<BloggerUploadMainForPostCommand>
{
  constructor(
    private readonly s3StorageAdapter: S3StorageAdapter,
    private readonly checkService: CheckService,
    private readonly postsRepository: PostsRepository,
  ) {}

  async execute(command: BloggerUploadMainForPostCommand) {
    const userId = command.userId;
    const blogId = command.blogId;
    const postId = command.postId;
    const bufferOrigin = command.postMainFile.buffer;
    const metadataOrigin = command.metadata;

    if (!(await this.checkService.isBlogExist(blogId))) {
      return ActionResult.BlogNotFound;
    }

    if (!(await this.checkService.isUserOwnerOfBlog(userId, blogId))) {
      return ActionResult.NotOwner;
    }

    const post: Posts = await this.postsRepository.getPostDBTypeById(postId);
    if (!post) {
      return ActionResult.PostNotFound;
    }

    try {
      const bufferMiddle = await sharp(bufferOrigin)
        .resize(300, 180)
        .toBuffer();

      const metadataMiddle = await sharp(bufferMiddle).metadata();

      const bufferSmall = await sharp(bufferOrigin).resize(149, 96).toBuffer();

      const metadataSmall = await sharp(bufferSmall).metadata();

      const [
        uploadedMainKeyOrigin,
        uploadedMainKeyMiddle,
        uploadedMainKeySmall,
      ] = await Promise.all([
        this.s3StorageAdapter.savePostMain(
          userId,
          blogId,
          postId,
          bufferOrigin,
          metadataOrigin,
          PostMainSizeEnum.origin,
        ),
        this.s3StorageAdapter.savePostMain(
          userId,
          blogId,
          postId,
          bufferMiddle,
          metadataMiddle,
          PostMainSizeEnum.middle,
        ),
        this.s3StorageAdapter.savePostMain(
          userId,
          blogId,
          postId,
          bufferSmall,
          metadataSmall,
          PostMainSizeEnum.small,
        ),
      ]);
      // const uploadedMainKeyMiddle = await this.s3StorageAdapter.savePostMain(

      // )
      const mainUrlOrigin = fullImageUrl(uploadedMainKeyOrigin);
      const mainUrlMiddle = fullImageUrl(uploadedMainKeyMiddle);
      const mainUrlSmall = fullImageUrl(uploadedMainKeySmall);

      post.PostMainImage.url = mainUrlOrigin;
      post.PostMainImage.width = metadataOrigin.width;
      post.PostMainImage.height = metadataOrigin.height;
      post.PostMainImage.fileSize = metadataOrigin.size;

      post.PostMainImage.urlMiddle = mainUrlMiddle;
      post.PostMainImage.widthMiddle = metadataMiddle.width;
      post.PostMainImage.heightMiddle = metadataMiddle.height;
      post.PostMainImage.fileSizeMiddle = metadataMiddle.size;

      post.PostMainImage.urlSmall = mainUrlSmall;
      post.PostMainImage.widthSmall = metadataSmall.width;
      post.PostMainImage.heightSmall = metadataSmall.height;
      post.PostMainImage.fileSizeSmall = metadataSmall.size;

      const savePostResult = await this.postsRepository.savePost(post);
      if (savePostResult) {
        return post.returnImageForPublic();
      } else {
        return ActionResult.NotCreated;
      }
    } catch (error) {
      return ActionResult.NotCreated;
    }
  }
}
