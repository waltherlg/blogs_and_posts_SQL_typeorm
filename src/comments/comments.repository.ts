import { Injectable } from '@nestjs/common';
import { CommentDBType } from './comments.types';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { Comments } from './comment.entity';

@Injectable()
export class CommentsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  async createComment(commentDTO: CommentDBType): Promise<string> {
    const result = await this.commentsRepository.save(commentDTO);
    return result.commentId;
  }

  async isCommentExist(commentId): Promise<boolean> {
    if (!isValidUUID(commentId)) {
      return false;
    }
    const result = await this.commentsRepository.count({where: {commentId: commentId}})
    return result > 0
  }

  async getCommentDbTypeById(commentId): Promise<CommentDBType | null> {
    if (!isValidUUID(commentId)) {
      return null;
    }
    const comment = await this.commentsRepository.findOne({where: {commentId: commentId}})
    return comment;
  }

  async deleteCommentById(commentId): Promise<boolean> {
    if (!isValidUUID(commentId)) {
      return false;
    }
    const result = await this.commentsRepository.delete(commentId)
    return result.affected > 0;
  }

  async updateCommentById(commentId, content): Promise<boolean> {
    const query = `
    UPDATE public."Comments"
    SET "content" = $2
    WHERE "commentId" = $1
    `;
    const result = await this.dataSource.query(query, [commentId, content]);
    const count = result[1];
    return count === 1;
  }
}
