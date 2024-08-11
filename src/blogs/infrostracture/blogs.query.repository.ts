import { Injectable } from '@nestjs/common';
import { BlogTypeOutput, blogSaTypeOutput } from '../blogs.types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { sortDirectionFixer } from '../../helpers/helpers.functions';
import { Blogs } from '../blog.entity';
import { PaginationOutputModel } from '../../models/types';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
  ) {}

  async getBlogById(blogId, userId?): Promise<BlogTypeOutput | null> {
    if (!isValidUUID(blogId)) {
      return null;
    }
    const blog: Blogs = await this.blogsRepository.findOne({
      // select: {
      //   blogId: true,
      //   name: true,
      //   description: true,
      //   websiteUrl: true,
      //   createdAt: true,
      //   isMembership: true,
      // },
      where: { blogId, isBlogBanned: false },
    });

    console.log(blog);

    if (blog) {
      return blog.returnForPublic(userId);
    }
    return null;
  }

  async getAllBlogs(
    mergedQueryParams,
    userId?,
  ): Promise<PaginationOutputModel<BlogTypeOutput>> {
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder('blog');
    queryBuilder
      .select([
        'blog.blogId',
        'blog.name',
        'blog.description',
        'blog.websiteUrl',
        'blog.createdAt',
        'blog.isMembership',
        'wallpaper.*',
        'main.*',
        'subscribers.*',
      ])
      .leftJoinAndSelect('blog.BlogWallpaperImage', 'wallpaper')
      .leftJoinAndSelect('blog.BlogMainImage', 'main')
      .leftJoinAndSelect('blog.BlogSubscribers', 'subscribers');

    if (searchNameTerm !== '') {
      queryBuilder
        .where(`blog.name ILIKE :searchNameTerm`, {
          searchNameTerm: `%${searchNameTerm}%`,
        })
        .andWhere(`blog.isBlogBanned = false`);
    }

    if (searchNameTerm === '') {
      queryBuilder.where(`blog.isBlogBanned = false`);
    }

    const blogsCount = await queryBuilder.getCount();

    const blogs = await queryBuilder
      .orderBy(`blog.${sortBy} COLLATE "C"`, sortDirection)
      .limit(pageSize)
      .offset(skipPage)
      // .skip(skipPage)
      // .take(pageSize)
      .getMany();
    console.log('blogs in getAllblogs ', blogs);

    const blogsForOutput = blogs.map((blog) => {
      return blog.returnForPublic(userId);
    });

    const pageCount = Math.ceil(blogsCount / pageSize);

    const outputBlogs = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: blogsCount,
      items: blogsForOutput,
    };
    return outputBlogs;
  }

  async getAllBlogsForSa(mergedQueryParams) {
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder('blog');
    queryBuilder
      .select('blog.*')
      .addSelect('user.login')
      .innerJoin('Users', 'user', 'blog.userId = user.userId');

    if (searchNameTerm !== '') {
      queryBuilder.where(`blog.name ILIKE :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      });
    }

    const blogsCount = await queryBuilder.getCount();

    const blogs = await queryBuilder
      .orderBy(`blog.${sortBy} COLLATE "C"`, sortDirection)
      .limit(pageSize)
      .offset(skipPage)
      // .skip(skipPage)
      // .take(pageSize)
      .getRawMany();

    const blogsForOutput = blogs.map((blog) => {
      return {
        id: blog.blogId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
        blogOwnerInfo: {
          userId: blog.userId,
          userLogin: blog.user_login,
        },
        banInfo: {
          isBanned: blog.isBlogBanned,
          banDate: blog.blogBanDate,
        },
      };
    });

    const pageCount = Math.ceil(blogsCount / pageSize);

    const outputBlogs = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: blogsCount,
      items: blogsForOutput,
    };
    return outputBlogs;
  }

  async getAllBlogsForCurrentUser(mergedQueryParams, userId) {
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder('blog');
    queryBuilder
      .select([
        'blog.blogId',
        'blog.name',
        'blog.description',
        'blog.websiteUrl',
        'blog.createdAt',
        'blog.isMembership',
        'wallpaper.*',
        'main.*',
      ])
      .leftJoinAndSelect('blog.BlogWallpaperImage', 'wallpaper')
      .leftJoinAndSelect('blog.BlogMainImage', 'main')

      .where('blog.userId = :userId AND blog.isBlogBanned = false', {
        userId: userId,
      });
    if (searchNameTerm !== '') {
      queryBuilder.andWhere(`blog.name ILIKE :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      });
    }

    const [blogs, blogsCount] = await queryBuilder
      .orderBy(`blog.${sortBy} COLLATE "C"`, sortDirection)
      .limit(pageSize)
      .offset(skipPage)
      // .skip(skipPage)d
      // .take(pageSize)
      .getManyAndCount();

    console.log('blogs in get blog for current user ', blogs);

    const pageCount = Math.ceil(blogsCount / pageSize);

    const blogsForOutput = blogs.map((blog) => {
      return blog.returnForPublic();
    });
    const outputBlogs = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: blogsCount,
      items: blogsForOutput,
    };
    return outputBlogs;
  }
}
