import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/posts.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class SaDeletePostByIdFromUriCommand {
  constructor(public blogId: string, public postId: string) {}
}

@CommandHandler(SaDeletePostByIdFromUriCommand)
export class SaDeletePostByIdFromUriUseCase
  implements ICommandHandler<SaDeletePostByIdFromUriCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}
  async execute(
    command: SaDeletePostByIdFromUriCommand,
  ): Promise<ActionResult> {
    const post = await this.postsRepository.getPostDBTypeById(command.postId);
    if (!post) return ActionResult.PostNotFound;
    const isDeleted = await this.postsRepository.deletePostById(command.postId);
    if (!isDeleted) return ActionResult.NotDeleted;
    return ActionResult.Success;
  }
}
