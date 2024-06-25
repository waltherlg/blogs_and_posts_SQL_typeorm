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

  //TODO: add transaction
  async createPost(postDTO: PostDBType): Promise<string> {
    const result = await this.postsRepository.save(postDTO);
    const emptyPostMainImage = new PostMainImage(postDTO.postId)
    const saveImageResult = await this.postsMainImageRepository.save(emptyPostMainImage)
    return result.postId;
  }

  async deletePostById(postId: string): Promise<boolean> {
    if (!isValidUUID(postId)) {
      return false;
    }
    const result = await this.postsRepository.delete(postId);
    return result.affected > 0;
  }

  async getPostDBTypeById(postId): Promise<PostDBType | null> {
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
