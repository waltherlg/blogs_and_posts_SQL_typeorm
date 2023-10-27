import { Injectable } from '@nestjs/common';
import { BlogTypeOutput, Blogs, blogSaTypeOutput } from '../blogs.types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource,
  @InjectRepository(Blogs) private readonly blogsRepository: Repository<Blogs>) {}

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
      where: { blogId, isBlogBanned: false }
    })
    if(result.length > 0){
      const blog = result[0]
      return {
        id: blog.blogId,
        name: blog.name,
        description: blog.description,
        websiteUrl: blog.websiteUrl,
        createdAt: blog.createdAt,
        isMembership: blog.isMembership
      }
    } 
    return null
  } 

  async getAllBlogs(mergedQueryParams) {
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection) ;
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder('blog');
    queryBuilder.select()

    if (searchNameTerm !== '') {
      queryBuilder.where(`blog.name ILIKE :searchNameTerm`, { searchNameTerm: `%${searchNameTerm}%` })
      .andWhere(`blog.isBlogBanned = false`)
    }

    if (searchNameTerm === '') {
      queryBuilder.where(`blog.isBlogBanned = false`)
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
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.blogsRepository.createQueryBuilder("blog");
    queryBuilder.select("blog.*")
    .addSelect("user.login")
    .innerJoin("Users", "user", "blog.userId = user.userId")

    if (searchNameTerm !== '') {
      queryBuilder.where(`blog.name ILIKE :searchNameTerm`, { searchNameTerm: `%${searchNameTerm}%` })
    }

    const blogsCount = await queryBuilder.getCount()

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
    const searchNameTerm = mergedQueryParams.searchNameTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryParams = [
      `%${searchNameTerm}%`,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      skipPage,
      userId,
    ];

    let query = `
    SELECT "blogId" AS id, name, description, "websiteUrl", "createdAt", "isMembership"
    FROM public."Blogs"
    WHERE "userId" = '${queryParams[6]}' AND "isBlogBanned" = false

    `;
    let countQuery = `
    SELECT COUNT(*)
    FROM public."Blogs"
    WHERE "userId" = '${queryParams[6]}' AND "isBlogBanned" = false
    `;

    if (searchNameTerm !== '') {
      query += `AND name ILIKE '${queryParams[0]}'`;
      countQuery += `AND name ILIKE '${queryParams[0]}'`;
    }

    query += ` ORDER BY "${queryParams[1]}" ${queryParams[2]}
    LIMIT ${queryParams[4]} OFFSET ${queryParams[5]};
    `;

    const blogsCountArr = await this.dataSource.query(countQuery);
    const blogsCount = parseInt(blogsCountArr[0].count);

    const blogs = await this.dataSource.query(query);

    const pageCount = Math.ceil(blogsCount / pageSize);

    const outputBlogs = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: blogsCount,
      items: blogs,
    };
    return outputBlogs;
  }
}
