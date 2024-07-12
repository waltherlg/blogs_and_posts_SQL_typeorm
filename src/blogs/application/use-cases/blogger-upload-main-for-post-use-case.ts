import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../../adapters/file-storage-adapter';
import { CheckService } from '../../../other.services/check.service';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { PostsRepository } from '../../../posts/posts.repository';
import { Posts } from '../../../posts/post.entity';
import { fullImageUrl } from '../../../helpers/helpers.functions';

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

    if (!(await this.checkService.isUserOwnerOfBlog(userId, blogId))) {
      return ActionResult.NotOwner;
    }

    const post: Posts = await this.postsRepository.getPostDBTypeById(postId);
    if (!post) {
      return ActionResult.PostNotFound;
    }
//TODO: make diferent sise of image
    try {
      const uploadedMainKey = await this.s3StorageAdapter.savePostMain(
        userId,
        blogId,
        postId,
        bufferOrigin,
        metadataOrigin,
      );
      const mainUrl = fullImageUrl(uploadedMainKey)

      post.PostMainImage.url = mainUrl;
      post.PostMainImage.width = metadataOrigin.width;
      post.PostMainImage.height = metadataOrigin.height;
      post.PostMainImage.fileSize = metadataOrigin.size;


      const savePostResult = await this.postsRepository.savePost(post);
      if (savePostResult) {
        return post.returnImageForPublic()
      } else {
        return ActionResult.NotCreated;
      }
    } catch (error) {
      return ActionResult.NotCreated;
    }
  }
}
