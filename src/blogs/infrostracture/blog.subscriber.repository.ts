import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlogSubscribers } from '../blog.subscriber.types';
import { Repository } from 'typeorm';

@Injectable()
export class BlogSubscribersRepository {
  constructor(
    @InjectRepository(BlogSubscribers)
    private readonly blogSubscribersRepository: Repository<BlogSubscribers>,
  ) {}

  async deleteBlogSubscribe(blogId, userId): Promise<boolean> {
    const result = await this.blogSubscribersRepository.delete({
      blogId,
      userId,
    });
    return result.affected > 0;
  }
}
