import { BlogsRepository } from '../../infrostracture/blogs.repository';
import { CommandHandler } from '@nestjs/cqrs/dist/decorators';
import { ICommandHandler } from '@nestjs/cqrs/dist/interfaces';
import { CreatePostByBlogsIdInputModelType } from '../../../blogs/api/blogger.blogs.controller';
import { PostsRepository } from '../../../posts/posts.repository';
import { PostDBType } from '../../../posts/posts.types';
import { v4 as uuidv4 } from 'uuid';
import { ActionResult } from '../../../helpers/enum.action.result.helper';
import { Posts } from '../../../posts/post.entity';
import { TelegramAdapter } from '../../../adapters/telegram.adapter';
import { SendPostNotificationsViaTelegramEvent } from './event-handlers/send-post-notifications-via-telegram-event-handler';
import { EventBus } from '@nestjs/cqrs';

export class CreatePostFromBloggerControllerCommand {
  constructor(
    public userId: string,
    public blogId: string,
    public postCreateDto: CreatePostByBlogsIdInputModelType,
  ) {}
}

@CommandHandler(CreatePostFromBloggerControllerCommand)
export class CreatePostFromBloggerControllerUseCase
  implements ICommandHandler<CreatePostFromBloggerControllerCommand>
{
  constructor(
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly telegramAdapter: TelegramAdapter,
    private readonly eventBus: EventBus
  ) {}

  async execute(
    command: CreatePostFromBloggerControllerCommand,
  ): Promise<ActionResult | string> {
    const blog = await this.blogsRepository.getBlogDBTypeById(command.blogId);
    if (!blog) return ActionResult.BlogNotFound;
    if (blog.userId !== command.userId) return ActionResult.NotOwner;

    const postDto = new Posts(
      uuidv4(),
      command.postCreateDto.title,
      command.postCreateDto.shortDescription,
      command.postCreateDto.content,
      command.blogId,
      new Date().toISOString(),
      blog.userId,
      0,
      0,
    );
    const newPostId = await this.postsRepository.createPost(postDto);
    if (!newPostId) return ActionResult.NotCreated;

    this.eventBus.publish(
      new SendPostNotificationsViaTelegramEvent(blog.blogId)
    );

    return newPostId;
  }
}
