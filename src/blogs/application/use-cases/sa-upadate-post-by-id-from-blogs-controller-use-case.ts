import { CommandHandler } from '@nestjs/cqrs/dist/decorators';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { UpdatePostByBlogsIdInputModelType } from '../../../blogs/api/blogger.blogs.controller';
import { PostsRepository } from '../../../posts/posts.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class SaUpdatePostByIdFromBloggerControllerCommand {
  constructor(
    public blogsId: string,
    public postId: string,
    public postUpdateDto: UpdatePostByBlogsIdInputModelType,
  ) {}
}

@CommandHandler(SaUpdatePostByIdFromBloggerControllerCommand)
export class SaUpdatePostByIdFromBloggerControllerUseCase
  implements ICommandHandler<SaUpdatePostByIdFromBloggerControllerCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}

  async execute(
    command: SaUpdatePostByIdFromBloggerControllerCommand,
  ): Promise<ActionResult> {
    const postId = command.postId;
    const post = await this.postsRepository.getPostDBTypeById(postId);
    if (!post) return ActionResult.PostNotFound;
    const title = command.postUpdateDto.title;
    const shortDescription = command.postUpdateDto.shortDescription;
    const content = command.postUpdateDto.content;

    const result = await this.postsRepository.updatePostById(
      postId,
      title,
      shortDescription,
      content,
    );
    if (result) {
      return ActionResult.Success;
    } else {
      return ActionResult.NotSaved;
    }
  }
}
