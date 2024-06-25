import { Injectable } from '@nestjs/common';
import { PostDBType } from './posts.types';

import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { Posts } from './post.entity';
import { PostMainImage } from './post.image.type';

@Injectable()
export class PostsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(PostMainImage)
    private readonly postsMainImageRepository: Repository<PostMainImage>,
  ) {}

 
  async savePost(post: Posts): Promise<boolean> {
    try {
      await this.postsRepository.save(post)
      return true
    } catch (error) {
      return false      
    }
  }
  async createPost(postDTO: Posts): Promise<string> {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(postDTO);
      const emptyPostMainImage = new PostMainImage(postDTO.postId);
      await queryRunner.manager.save(emptyPostMainImage);
  
      await queryRunner.commitTransaction();
      return result.postId;
    } catch (error) {
      console.error('Post not created:', error);
      await queryRunner.rollbackTransaction();
      return null;
    } finally {
      await queryRunner.release();
    }
  }

  async deletePostById(postId: string): Promise<boolean> {
    if (!isValidUUID(postId)) {
      return false;
    }
    const result = await this.postsRepository.delete(postId);
    return result.affected > 0;
  }

  async getPostDBTypeById(postId): Promise<Posts | null> {
    if (!isValidUUID(postId)) {
      return null;
    }
    const result = await this.postsRepository.findOne({
      where: [{ postId: postId }],
    });
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
      { postId: postId },
      {
        title: title,
        shortDescription: shortDescription,
        content: content,
      },
    );
    return result.affected > 0;
  }

  async isPostExist(postId: string): Promise<boolean> {
    if (!isValidUUID(postId)) {
      return false;
    }
    const result = await this.postsRepository.count({
      where: { postId: postId },
    });
    return result > 0;
  }
}
