import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { CommentLikeDbType, PostLikeDbType } from './db.likes.types';
import { CommentLikes, PostLikes } from './like.entity';
import { Posts } from '../posts/post.entity';
import { Comments } from '../comments/comment.entity';

@Injectable()
export class LikesRepository {
  constructor(
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(CommentLikes)
    private readonly commentLikesRepository: Repository<CommentLikes>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
  ) {}

  async getPostLikeObject(userId, postId): Promise<PostLikeDbType | null> {
    const postLikeObject = await this.postLikesRepository.findOne({
      where: {
        userId: userId,
        postId: postId,
      },
    });
    return postLikeObject;
  }

  async addPostLikeStatus(postLikeDto: PostLikeDbType): Promise<boolean> {
    const result = await this.postLikesRepository.save(postLikeDto);
    return !!result.postId;
  }

  async updatePostLike(postId, userId, status): Promise<boolean> {
    if (!isValidUUID(postId) || !isValidUUID(userId)) {
      return false;
    }
    const result = await this.postLikesRepository.update(
      { postId: postId, userId: userId },
      { status: status },
    );
    return result.affected > 0;
  }

  async addCommentLikeStatus(commentLikeDto: CommentLikeDbType) {
    const result = await this.commentLikesRepository.save(commentLikeDto);
    return !!result.commentId;
  }

  async updateCommentLike(commentId, userId, status): Promise<boolean> {
    if (!isValidUUID(commentId) || !isValidUUID(userId)) {
      return false;
    }
    const result = await this.commentLikesRepository.update(
      { userId: userId, commentId: commentId },
      { status: status },
    );
    return result.affected > 0;
  }

  async getCommentLikeObject(
    userId,
    commentId,
  ): Promise<CommentLikeDbType | null> {
    const commentLikeObject = await this.commentLikesRepository.findOne({
      where: {
        userId: userId,
        commentId: commentId,
      },
    });
    return commentLikeObject;
  }

  async countAndSetPostLikesAndDislikesForSpecificPost(
    postId,
  ): Promise<boolean> {
    const postLikesCount = await this.postLikesRepository
      .createQueryBuilder('postLike')
      .leftJoin('postLike.Users', 'user')
      .where('postLike.postId = :postId', { postId: postId })
      .andWhere('user.isUserBanned = false')
      .andWhere("postLike.status = 'Like'")
      .getCount();

    const postDislikesCount = await this.postLikesRepository
      .createQueryBuilder('postLike')
      .leftJoin('postLike.Users', 'user')
      .where('postLike.postId = :postId', { postId: postId })
      .andWhere('user.isUserBanned = false')
      .andWhere("postLike.status = 'Dislike'")
      .getCount();

    const isLikesCountSet = await this.postsRepository.update(
      { postId: postId },
      {
        likesCount: postLikesCount,
        dislikesCount: postDislikesCount,
      },
    );
    return isLikesCountSet.affected > 0;
  }

  async multiplecountAndSetPostLikesAndDislikesForPosts(postIdArray) {
    const promises = postIdArray.map((postId) =>
      this.countAndSetPostLikesAndDislikesForSpecificPost(postId),
    );
    const results = await Promise.all(promises);
    return results;
  }

  async countAndSetCommentPostLikesAndDislikesForSpecificPost(
    commentId,
  ): Promise<boolean> {
    const commentLikesCount = await this.commentLikesRepository
      .createQueryBuilder('commentLike')
      .leftJoin('commentLike.Users', 'user')
      .where('commentLike.commentId = :commentId', { commentId: commentId })
      .andWhere('user.isUserBanned = false')
      .andWhere("commentLike.status = 'Like'")
      .getCount();

    const commentDislikesCount = await this.commentLikesRepository
      .createQueryBuilder('commentLike')
      .leftJoin('commentLike.Users', 'user')
      .where('commentLike.commentId = :commentId', { commentId: commentId })
      .andWhere('user.isUserBanned = false')
      .andWhere("commentLike.status = 'Dislike'")
      .getCount();

    const isLikesCountSet = await this.commentsRepository.update(
      { commentId: commentId },
      {
        likesCount: commentLikesCount,
        dislikesCount: commentDislikesCount,
      },
    );
    return isLikesCountSet.affected > 0;
  }

  async recountPostLikesAfterUserBanChange(userId) {
    if (!isValidUUID(userId)) {
      return null;
    }
    const queryBuilder = this.commentLikesRepository.createQueryBuilder('postLike')
    queryBuilder
    .select('post.postId', 'postId')
    .where('post.userId = :userId', {userId: userId})

    const postIdArray = await queryBuilder
    .getMany()

    const promises = postIdArray.map((postId) =>
    this.countAndSetPostLikesAndDislikesForSpecificPost(postId),
  );
  const results = await Promise.all(promises);
  return results;
  }
}
