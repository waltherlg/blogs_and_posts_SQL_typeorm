import { Injectable } from '@nestjs/common';
import { BlogTypeOutput, Blogs, blogSaTypeOutput } from '../blogs.types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';

@Injectable()
export class BlogsQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
  ) {}

  async getBlogById(blogId): Promise<BlogTypeOutput | null> {
    if (!isValidUUID(blogId)) {
      return null;
    }
    const result = await this.blogsRepository.find({
      select: {
        blogId: true,
        name: true,
        description: true,
        websiteUrl: true,
        createdAt: true,
        isMembership: true,
      },
      where: { blogId, isBlogBanned: false },
    });
    if (result.length > 0) {
      const blog = result[0];
      return {
        id: blog.blogId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
    }
    return null;
  }

  async getAllBlogs(mergedQueryParams) {
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder('blog');
    queryBuilder.select();

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
      .orderBy(`blog.${sortBy}`, sortDirection)
      .skip(skipPage)
      .take(pageSize)
      .getMany();
    const blogsForOutput = blogs.map((blog) => {
      return {
        id: blog.blogId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
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

  async getAllBlogsForSa(mergedQueryParams) {
    //TODO: нужно проверить на работоспособность
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
      .orderBy(`blog.${sortBy}`, sortDirection)
      .skip(skipPage)
      .take(pageSize)
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
          userLogin: blog.login,
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
    // TODO: in progress
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder('blog'); // TODO: разобраться с тем как выглядит документ, выходящий из бд
    queryBuilder
      .select([
        'blog.blogId',
        'blog.name',
        'blog.description',
        'blog.websiteUrl',
        'blog.createdAt',
        'blog.isMembership',
      ])
      .where('blog.userId = :userId AND blog.isBlogBanned = false', {
        userId: userId,
      });
    if (searchNameTerm !== '') {
      queryBuilder.andWhere(`blog.name ILIKE :searchNameTerm`, {
        searchNameTerm: `%${searchNameTerm}%`,
      });
    }
    const blogsCount = await queryBuilder.getCount();

    const blogs = await queryBuilder
      .orderBy(`blog.${sortBy}`, sortDirection)
      .skip(skipPage)
      .take(pageSize)
      .getMany();
    const pageCount = Math.ceil(blogsCount / pageSize);

    const blogsForOutput = blogs.map((blog) => {
      return {
        id: blog.blogId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership,
      };
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
