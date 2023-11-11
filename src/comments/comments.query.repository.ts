import { CommentTypeOutput } from './comments.types';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { CommentLikeDbType } from '../likes/db.likes.types';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';
import { Comments } from './comment.entity';
import { CommentLikes } from '../likes/like.entity';
import { Posts } from '../posts/post.entity';
@Injectable()
export class CommentsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource,
              @InjectRepository(Comments) private readonly commentsRepository: Repository<Comments>,
              @InjectRepository(CommentLikes) private readonly commentLikesRepository: Repository<CommentLikes>,
              @InjectRepository(Posts) private readonly postsRepository: Repository<Posts>) {}

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

  //   const result = await this.postsRepository.findOne({ // хороший был бы вариант
  //     where: { postId: postId }, 
  //     relations: ["Comments"]
  // });
  // const comments = result.Comments

    const queryBuilder = this.commentsRepository.createQueryBuilder('comment')
    queryBuilder
    .leftJoin('comment.Users', 'user')
    .leftJoinAndSelect('comment.Posts', 'post')
    .leftJoinAndSelect('post.Blogs', 'blog')
    .select('comment.commentId', 'commentId')
    .addSelect('comment.postId', 'postId')
    .addSelect('comment.content', 'content')
    .addSelect('comment.createdAt', 'createdAt')
    .addSelect('comment.userId', 'userId')
    .addSelect('comment.likesCount', 'likesCount')
    .addSelect('comment.dislikesCount', 'dislikesCount')
    .addSelect('user.login', 'login')
    .where('comment.postId = :postId', {postId: postId})
    .andWhere('user.isUserBanned = false')
    .andWhere('blog.isBlogBanned = false')

    const commentCount = await queryBuilder.getCount()

    const comments = await queryBuilder  
    .orderBy(`comment.${sortBy}`, sortDirection)
    .skip(skipPage)
    .take(pageSize)
    .getRawMany()

    let usersLikeObjectsForThisComments;
    if (userId) {
      //если пришел userId то нужно узнать его лайкстатус для каждого коммента
      //нужен массив из айдишек комментов, которые вернул основной запрос
      const arrayOfCommentsId = comments.map((comment) => {
        return comment.commentId;
      });

      // нужно найти все лайки где есть айди пользователя и коммент айди из массива выше
      usersLikeObjectsForThisComments = await this.commentLikesRepository.createQueryBuilder('commentLikes')
    .where('commentLikes.userId = :userId', { userId: userId })
    .andWhere('commentLikes.commentId IN (:...commentIds)', { commentIds: arrayOfCommentsId })
    .getMany();
    }

    const commentsForOutput = comments.map((comment) => { //TODO: спросить почему сломалась типизация : CommentTypeOutput
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
