import { Injectable } from '@nestjs/common';
import { PostDBType, Posts } from './posts.types';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class PostsRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource,
              @InjectRepository(Posts) private readonly postsRepository: Repository<Posts> ) {}

  async createPost(postDTO: PostDBType): Promise<string> {
    const result = await this.postsRepository.save(postDTO);
    return result.postId
  }

  async deletePostById(postId: string): Promise<boolean> {
        if (!isValidUUID(postId)) {
      return false;
    }
    const result = await this.postsRepository.delete(postId)
    return result.affected > 0;
  }

  async getPostDBTypeById(postId): Promise<PostDBType | null> {
    if (!isValidUUID(postId)) {
      return null;
    }
    const result = await this.postsRepository.findOne(postId)
    return result;
  }

  async updatePostById(
    postId: string,
    title: string,
    shortDescription: string,
    content: string,
  ): Promise<boolean> {
    if (!isValidUUID(postId)) {
      return false;
    }
    const result = await this.postsRepository.update(
      { postId },
      {
        title,
        shortDescription,
        content,
      }
    )
    return result.affected > 0;
  }

  async isPostExist(postId: string): Promise<boolean> {
    if (!isValidUUID(postId)) {
      return false;
    }
    const result = await this.postsRepository.count({where: {postId: postId}})
    return result > 0;
  }
}
