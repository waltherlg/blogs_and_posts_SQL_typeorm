import { Injectable } from '@nestjs/common';
import { PaginationOutputModel } from '../models/types';
import { PostTypeOutput } from './posts.types';
import { validate as isValidUUID } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PostLikeDbType } from '../likes/db.likes.types';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';
import { Posts } from './post.entity';
import { PostLikes } from '../likes/like.entity';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
  ) {}

  async getPostById(postId, userId?): Promise<PostTypeOutput | null> {
    if (!isValidUUID(postId)) {
      return null;
    }
    const postQueryBuilder = this.postsRepository.createQueryBuilder('post');
    postQueryBuilder
      .leftJoin('post.Blogs', 'blog')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.shortDescription', 'shortDescription')
      .addSelect('post.content', 'content')
      .addSelect('post.blogId', 'blogId')
      .addSelect('blog.name', 'blogName')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.likesCount', 'likesCount')
      .addSelect('post.dislikesCount', 'dislikesCount')
      .where('post.postId = :postId', { postId: postId })
      .andWhere('blog.isBlogBanned = false');
    const post = await postQueryBuilder.getRawOne();

    if (!post) {
      return null;
    }

    const newestLikesQueryBuilder =
      this.postLikesRepository.createQueryBuilder('postLike');
    newestLikesQueryBuilder
      .leftJoin('postLike.Users', 'user')
      .select('postLike.addedAt', 'addedAt')
      .addSelect('user.login', 'login')
      .addSelect('postLike.userId', 'userId')
      .where('postLike.postId = :postId', { postId: postId })
      .andWhere('postLike.status = :status', { status: 'Like' })
      .andWhere('user.isUserBanned = false')
      .orderBy('postLike.addedAt', 'DESC')
      .limit(3);

    const newestLikes = await newestLikesQueryBuilder.getRawMany();
    let myStatus = 'None';
    if (userId) {
      const usersLike = await this.getPostLikeObject(userId, postId);
      if (usersLike) {
        myStatus = usersLike.status;
      }
    }

    return {
      id: post.postId,
      title: post.title,
      shortDescription: post.shortDescription,
      content: post.content,
      blogId: post.blogId,
      blogName: post.blogName,
      createdAt: post.createdAt,
      extendedLikesInfo: {
        likesCount: parseInt(post.likesCount),
        dislikesCount: parseInt(post.dislikesCount),
        myStatus: myStatus,
        newestLikes: newestLikes,
      },
    };
  }

  async getAllPosts(mergedQueryParams, userId?) {
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.postsRepository.createQueryBuilder('post');
    queryBuilder
      .leftJoin('post.Blogs', 'blog')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.shortDescription', 'shortDescription')
      .addSelect('post.content', 'content')
      .addSelect('post.blogId', 'blogId')
      .addSelect('blog.name', 'blogName')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.likesCount', 'likesCount')
      .addSelect('post.dislikesCount', 'dislikesCount');

    const postCount = await queryBuilder.getCount();

    const posts = await queryBuilder
      .orderBy(`"${sortBy}"`, sortDirection)
      .limit(pageSize)
      .offset(skipPage)
      .getRawMany();

    const postLikeQueryBuilder =
      this.postLikesRepository.createQueryBuilder('postLike');
    const postLikesObjectArray = await postLikeQueryBuilder
      .leftJoin('postLike.Users', 'user')
      .select('postLike.addedAt', 'addedAt')
      .addSelect('postLike.postId', 'postId')
      .addSelect('postLike.userId', 'userId')
      .addSelect('user.login', 'login')
      .addSelect('postLike.status', 'status')
      .addSelect('user.isUserBanned', 'isUserBanned')
      .orderBy('postLike.addedAt', 'DESC')
      .getRawMany();

    const onlyLikeObjects = postLikesObjectArray.filter(
      (likeObject) =>
        likeObject.status === 'Like' && likeObject.isUserBanned === false,
    );

    const postsForOutput = posts.map((post) => {
      const thisPostLikes = onlyLikeObjects.filter(
        (likeObj) => likeObj.postId === post.postId,
      );

      const newestLikes = thisPostLikes.slice(0, 3).map((like) => {
        return {
          addedAt: like.addedAt,
          userId: like.userId,
          login: like.login,
        };
      });

      let myStatus = 'None';
      if (userId) {
        const foundLike = postLikesObjectArray.find(
          (postLikeObject) =>
            postLikeObject.postId === post.postId &&
            postLikeObject.userId === userId,
        );
        if (foundLike) {
          myStatus = foundLike.status;
        }
      }
      return {
        id: post.postId,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: parseInt(post.likesCount),
          dislikesCount: parseInt(post.dislikesCount),
          myStatus: myStatus,
          newestLikes: newestLikes,
        },
      };
    });

    const pageCount = Math.ceil(postCount / pageSize);

    const outputPosts = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: postCount,
      items: postsForOutput,
    };
    return outputPosts;
  }

  async getAllPostsByBlogsId(
    mergedQueryParams,
    blogId,
    userId?,
  ): Promise<PaginationOutputModel<PostTypeOutput>> {
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryParams = [
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      skipPage,
      blogId,
    ];

    const queryBuilder = this.postsRepository.createQueryBuilder('post');
    queryBuilder
      .leftJoin('post.Blogs', 'blog')
      .select('post.postId', 'postId')
      .addSelect('post.title', 'title')
      .addSelect('post.shortDescription', 'shortDescription')
      .addSelect('post.content', 'content')
      .addSelect('post.blogId', 'blogId')
      .addSelect('blog.name', 'blogName')
      .addSelect('post.createdAt', 'createdAt')
      .addSelect('post.likesCount', 'likesCount')
      .addSelect('post.dislikesCount', 'dislikesCount')
      .where('post.blogId = :blogId', { blogId: blogId })
      .andWhere('blog.isBlogBanned = false');

    const postCount = await queryBuilder.getCount();

    const posts = await queryBuilder
      .orderBy(`"${sortBy}"`, sortDirection)
      .limit(pageSize)
      .offset(skipPage)
      .getRawMany();

    const postLikeQueryBuilder =
      this.postLikesRepository.createQueryBuilder('postLike');
    const postLikesObjectArray = await postLikeQueryBuilder
      .leftJoin('postLike.Users', 'user')
      .select('postLike.addedAt', 'addedAt')
      .addSelect('postLike.postId', 'postId')
      .addSelect('postLike.userId', 'userId')
      .addSelect('user.login', 'login')
      .addSelect('postLike.status', 'status')
      .addSelect('user.isUserBanned', 'isUserBanned')
      .orderBy('postLike.addedAt', 'DESC')
      .getRawMany();

    const onlyLikeObjects = postLikesObjectArray.filter(
      (likeObject) =>
        likeObject.status === 'Like' && likeObject.isUserBanned === false,
    );

    const postsForOutput = posts.map((post) => {
      const thisPostLikes = onlyLikeObjects.filter(
        (likeObj) => likeObj.postId === post.postId,
      );

      const newestLikes = thisPostLikes.slice(0, 3).map((like) => {
        return {
          addedAt: like.addedAt,
          userId: like.userId,
          login: like.login,
        };
      });

      let myStatus = 'None';
      if (userId) {
        const foundLike = postLikesObjectArray.find(
          (postLikeObject) =>
            postLikeObject.postId === post.postId &&
            postLikeObject.userId === userId,
        );
        if (foundLike) {
          myStatus = foundLike.status;
        }
      }
      return {
        id: post.postId,
        title: post.title,
        shortDescription: post.shortDescription,
        content: post.content,
        blogId: post.blogId,
        blogName: post.blogName,
        createdAt: post.createdAt,
        extendedLikesInfo: {
          likesCount: parseInt(post.likesCount),
          dislikesCount: parseInt(post.dislikesCount),
          myStatus: myStatus,
          newestLikes: newestLikes,
        },
      };
    });

    const pageCount = Math.ceil(postCount / pageSize);

    const outputPosts = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: postCount,
      items: postsForOutput,
    };
    return outputPosts;
  }

  private async getPostLikeObject(
    userId,
    postId,
  ): Promise<PostLikeDbType | null> {
    const postLikeObject = await this.postLikesRepository.findOne({
      where: {
        userId: userId,
        postId: postId,
      },
    });
    return postLikeObject;
  }
}
