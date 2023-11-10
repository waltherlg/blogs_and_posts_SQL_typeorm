import { CommentTypeOutput } from './comments.types';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { CommentLikeDbType } from '../likes/db.likes.types';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';
import { Comments } from './comment.entity';
import { CommentLikes } from '../likes/like.entity';
@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource,
              @InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>,
              @InjectRepository(CommentLikes) private readonly commentLikesRepository: Repository<CommentLikes>) {}

  async getCommentById(
    commentId: string,
    userId?: string,
  ): Promise<CommentTypeOutput | null> {
    if (!isValidUUID(commentId)) {
      return null;
    }

    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
    const comment = await queryBuilder
    .leftJoin('comment.Users', 'user')
    .select('comment.commentId', 'commentId')
    .addSelect('comment.postId', 'postId')
    .addSelect('comment.content', 'content')
    .addSelect('comment.createdAt', 'createdAt')
    .addSelect('comment.userId', 'userId')
    .addSelect('comment.likesCount', 'likesCount')
    .addSelect('comment.dislikesCount', 'dislikesCount')
    .addSelect('user.login', 'login')
    .where('comment.commentId = :commentId', {commentId: commentId})
    .andWhere('user.isUserBanned = false')
    .getRawOne()

    if (!comment) {
      return null;
    }

    let myStatus = 'None';

    if (userId) {
      const myLikeObject = await this.commentLikesRepository.findOne({
        where: {
          userId: userId,
          commentId: commentId
        }
      })
      if(myLikeObject){
        myStatus = myLikeObject.status
      }
    }

    return {
      id: comment.commentId,
      content: comment.content,
      commentatorInfo: {
        userId: comment.userId,
        userLogin: comment.login,
      },
      createdAt: comment.createdAt,
      likesInfo: {
        likesCount: parseInt(comment.likesCount),
        dislikesCount: parseInt(comment.dislikesCount),
        myStatus: myStatus,
      },
    };
  }

  async getAllCommentsByPostId(postId: string, mergedQueryParams, userId?) {
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = mergedQueryParams.pageNumber;
    const pageSize = mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryParams = [
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      skipPage,
      postId,
    ];

    let query = `
    SELECT "Comments".*, "Users".login, "Users"."isUserBanned", "Blogs"."isBlogBanned"
    FROM public."Comments"
    INNER JOIN "Users" ON "Comments"."userId" = "Users"."userId"
    INNER JOIN "Posts" ON "Comments"."postId" = "Posts"."postId"
    INNER JOIN "Blogs" ON "Posts"."blogId" = "Blogs"."blogId"
    WHERE "Users"."isUserBanned" = false AND "Blogs"."isBlogBanned" = false AND "Comments"."postId" = '${queryParams[5]}'
    `;

    const countQuery = `
    SELECT COUNT(*) as "count"
    FROM public."Comments"
    INNER JOIN "Users" ON "Comments"."userId" = "Users"."userId"
    INNER JOIN "Posts" ON "Comments"."postId" = "Posts"."postId"
    INNER JOIN "Blogs" ON "Posts"."blogId" = "Blogs"."blogId"
    WHERE "Users"."isUserBanned" = false AND "Blogs"."isBlogBanned" = false AND "Comments"."postId" = '${queryParams[5]}'
    `;
    query += ` ORDER BY "${queryParams[0]}" ${queryParams[1]}
    LIMIT ${queryParams[3]} OFFSET ${queryParams[4]};
    `;

    const commentCountArr = await this.dataSource.query(countQuery);

    const commentCount = parseInt(commentCountArr[0].count);

    const comments = await this.dataSource.query(query);

    let usersLikeObjectsForThisComments;
    if (userId) {
      //если пришел userId то нужно узнать его лайкстатус для каждого коммента

      //нужен массив из айдишек комментов, которые вернул основной запрос

      const arrayOfCommentsId = comments.map((comment) => {
        return comment.commentId;
      });

      // нужно найти все лайки где есть айди пользователя и коммент айди из массива выше
      const usersLikeObjectsQuery = `
      SELECT *
      FROM public."CommentLikes"
      WHERE "userId" = '${userId}' AND "commentId" = ANY(ARRAY[${arrayOfCommentsId
        .map((id) => `'${id}'`)
        .join(',')}]::uuid[])
      `;
      // нужно подробно разобраться как эта хрень работает

      usersLikeObjectsForThisComments = await this.dataSource.query(
        usersLikeObjectsQuery,
      );
    }

    const commentsForOutput: CommentTypeOutput = comments.map((comment) => {
      let myStatus = 'None';
      if (userId) {
        const foundLike = usersLikeObjectsForThisComments.find(
          (commentLikeObject) =>
            commentLikeObject.commentId === comment.commentId,
        );
        if (foundLike) {
          myStatus = foundLike.status;
        }
      }
      return {
        id: comment.commentId,
        content: comment.content,
        commentatorInfo: {
          userId: comment.userId,
          userLogin: comment.login,
        },
        createdAt: comment.createdAt,
        likesInfo: {
          likesCount: parseInt(comment.likesCount),
          dislikesCount: parseInt(comment.dislikesCount),
          myStatus: myStatus,
        },
      };
    });

    const pageCount = Math.ceil(commentCount / pageSize);

    const outputComments = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: commentCount,
      items: commentsForOutput,
    };
    return outputComments;
  }

  async getCommentLikeObject(
    userId,
    commentId,
  ): Promise<CommentLikeDbType | null> {

    const commentLikeObject = await this.commentLikesRepository.findOne({
      where: { 
        userId: userId,
        commentId: commentId
      }
    })
    return commentLikeObject
  }
}
