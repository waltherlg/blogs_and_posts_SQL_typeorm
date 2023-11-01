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
    const query = `
    UPDATE public."Posts"
    SET title = $2, "shortDescription" = $3, "content" = $4
    WHERE "postId" = $1
    `;
    const result = await this.dataSource.query(query, [
      postId,
      title,
      shortDescription,
      content,
    ]);
    const count = result[1];
    return count === 1;
  }

  async isPostExist(postId: string): Promise<boolean> {
    if (!isValidUUID(postId)) {
      return false;
    }
    const query = `
    SELECT COUNT(*) AS count
    FROM public."Posts"
    WHERE "postId" = $1
  `;
    const result = await this.dataSource.query(query, [postId]);
    const count = result[0].count;
    return count > 0;
  }
}
