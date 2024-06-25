import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { S3StorageAdapter } from '../../../adapters/file-storage-adapter';
import { CheckService } from '../../../other.services/check.service';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { PostsRepository } from '../../../posts/posts.repository';
import { Posts } from '../../../posts/post.entity';

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
    private readonly postsRepository: PostsRepository
  ) {}

  async execute(command: BloggerUploadMainForPostCommand) {
    const userId = command.userId;
    const blogId = command.blogId;
    const postId = command.postId;
    const buffer = command.postMainFile.buffer;
    const metadata = command.metadata;

    if (!(await this.checkService.isUserOwnerOfBlog(userId, blogId))) {
      return ActionResult.NotOwner;
    }

    const post: Posts = await this.postsRepository.getPostDBTypeById(postId)
    if(!post){
      return ActionResult.PostNotFound
    }

    try {
      const uploadedMainKey = await this.s3StorageAdapter.savePostMain(
        userId,
        blogId,
        postId,
        buffer,
        metadata,
      );
      post.PostMainImage.url = uploadedMainKey;
      post.PostMainImage.width = command.metadata.width;
      post.PostMainImage.height = command.metadata.height;
      post.PostMainImage.fileSize = command.metadata.size;
      const savePostResult = await this.postsRepository.savePost(post)
      if(savePostResult) {
        //TODO
      } else {
        return ActionResult.NotCreated
      }
    } catch (error) {
      return ActionResult.NotCreated;
    }
  }
}
