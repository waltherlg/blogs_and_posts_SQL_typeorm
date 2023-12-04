import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/posts.repository';
import { ActionResult } from '../../../helpers/enum.action.result.helper';

export class DeletePostByIdFromUriCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostByIdFromUriCommand)
export class DeletePostByIdFromUriUseCase
  implements ICommandHandler<DeletePostByIdFromUriCommand>
{
  constructor(private readonly postsRepository: PostsRepository) {}
  async execute(command: DeletePostByIdFromUriCommand): Promise<ActionResult> {
    const post = await this.postsRepository.getPostDBTypeById(command.postId);
    if (!post) return ActionResult.PostNotFound;
    if (post.userId !== command.userId) return ActionResult.NotOwner;
    const isDeleted = await this.postsRepository.deletePostById(command.postId);
    if (!isDeleted) return ActionResult.NotDeleted;
    return ActionResult.Success;
  }
}
