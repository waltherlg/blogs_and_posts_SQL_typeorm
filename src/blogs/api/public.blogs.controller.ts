import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrostracture/blogs.query.repository';
import {
  DEFAULT_BLOGS_QUERY_PARAMS,
  RequestQueryParamsModel,
  RequestBlogsQueryModel,
  DEFAULT_QUERY_PARAMS,
} from '../../models/types';
import { MaxLength } from 'class-validator';
import { CheckService } from '../../other.services/check.service';
import { PostsQueryRepository } from '../../posts/posts.query.repository';

import {
  BlogNotFoundException,
  CustomisableException,
} from '../../exceptions/custom.exceptions';
import { IsCustomUrl, StringTrimNotEmpty } from '../../middlewares/validators';
import { OptionalJwtAuthGuard } from '../../auth/guards/optional-jwt-auth.guard';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { request } from 'express';
import { CommandBus } from '@nestjs/cqrs';
import { UserSubscribeBlogCommand } from '../application/use-cases/user-subscribe-blog-use-case';
import { handleActionResult } from '../../helpers/enum.action.result.helper';
import { UserUnsubscribeFromBlogCommand } from '../application/use-cases/user-unsubscribe-from-blog-use-case';

export class CreateBlogInputModelType {
  @StringTrimNotEmpty()
  @MaxLength(15)
  name: string;
  @StringTrimNotEmpty()
  @MaxLength(500)
  description: string;
  @StringTrimNotEmpty()
  @IsCustomUrl({ message: 'Invalid URL format' })
  websiteUrl: string;
}

export class UpdateBlogInputModelType {
  @StringTrimNotEmpty()
  @MaxLength(15)
  name: string;
  @StringTrimNotEmpty()
  @MaxLength(500)
  description: string;
  @StringTrimNotEmpty()
  @IsCustomUrl({ message: 'Invalid URL format' })
  websiteUrl: string;
}

export class CreatePostByBlogsIdInputModelType {
  @StringTrimNotEmpty()
  @MaxLength(30)
  title: string;
  @StringTrimNotEmpty()
  @MaxLength(100)
  shortDescription: string;
  @StringTrimNotEmpty()
  @MaxLength(1000)
  content: string;
}
@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly checkService: CheckService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Get()
  async getAllBlogs(
    @Query() queryParams: RequestBlogsQueryModel,
    @Req() request,
  ) {
    const mergedQueryParams = { ...DEFAULT_BLOGS_QUERY_PARAMS, ...queryParams };
    return await this.blogsQueryRepository.getAllBlogs(
      mergedQueryParams,
      request.user.userId,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id/posts')
  async getAllPostsByBlogsId(
    @Req() request,
    @Param('id') blogId: string,
    @Query() queryParams: RequestQueryParamsModel,
  ) {
    if (!(await this.checkService.isBlogExist(blogId))) {
      throw new BlogNotFoundException();
    }
    const mergedQueryParams = { ...DEFAULT_QUERY_PARAMS, ...queryParams };
    return await this.postsQueryRepository.getAllPostsByBlogsId(
      mergedQueryParams,
      blogId,
      request.user.userId,
    );
  }

  @UseGuards(OptionalJwtAuthGuard)
  @Get(':id')
  async getBlogById(@Param('id') blogId: string, @Req() request) {
    const blog = await this.blogsQueryRepository.getBlogById(
      blogId,
      request.user.userId,
    );
    if (!blog) {
      throw new CustomisableException('blog', 'blog not found', 404);
    }
    return blog;
  }

  @UseGuards(JwtAuthGuard)
  @Post(':blogId/subscription')
  @HttpCode(204)
  async subscribeUserToBlog(@Req() request, @Param('blogId') blogId) {
    const result = await this.commandBus.execute(
      new UserSubscribeBlogCommand(request.user.userId, blogId),
    );
    handleActionResult(result);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':blogId/subscription')
  @HttpCode(204)
  async unsubscribeUserFromBlog(@Req() request, @Param('blogId') blogId) {
    const result = await this.commandBus.execute(
      new UserUnsubscribeFromBlogCommand(request.user.userId, blogId),
    );
    handleActionResult(result);
  }
}
