import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrostracture/blogs.query.repository';
import {
  DEFAULT_BLOGS_QUERY_PARAMS,
  DEFAULT_QUERY_PARAMS,
  RequestBlogsQueryModel,
  RequestQueryParamsModel,
} from '../../models/types';
import { IsBoolean, MaxLength, MinLength } from 'class-validator';
import { CheckService } from '../../other.services/check.service';
import { PostsQueryRepository } from '../../posts/posts.query.repository';

import {
  CustomNotFoundException,
  UnableException,
} from '../../exceptions/custom.exceptions';
import { IsCustomUrl, StringTrimNotEmpty } from '../../middlewares/validators';
import { CreateBlogCommand } from '../application/use-cases/blogger-create-blog-use-case';
import { UpdateBlogByIdFromUriCommand } from '../application/use-cases/blogger-upadate-blog-using-id-from-uri-use-case';
import { CommandBus } from '@nestjs/cqrs';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { UpdatePostByIdFromBloggerControllerCommand } from '../application/use-cases/blogger-upadate-post-by-id-from-blogs-controller-use-case';
import { DeleteBlogByIdFromUriCommand } from '../application/use-cases/blogger-delete-blog-by-id-use-case';
import { CreatePostFromBloggerControllerCommand } from '../application/use-cases/blogger-create-post-from-blogs-controller-use-case';
import { DeletePostByIdFromUriCommand } from '../application/use-cases/blogger-delete-post-by-id-use-case';
import { CommentsQueryRepository } from '../../comments/comments.query.repository';
import {
  ActionResult,
  handleActionResult,
} from '../../helpers/enum.action.result.helper';
import { FileInterceptor } from '@nestjs/platform-express';
import { BloggerUploadWallpaperForBlogCommand } from '../application/use-cases/blogger-upload-wallpaper-for-blog-use-case';

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

export class UpdatePostByBlogsIdInputModelType {
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

export class BanUserForBlogInputModelType {
  @IsBoolean()
  isBanned: boolean;
  @StringTrimNotEmpty()
  @MinLength(20)
  banReason: string;
  @StringTrimNotEmpty()
  blogId: string;
}
@UseGuards(JwtAuthGuard)
//@Controller('blogger/blogs')
@Controller('blogger/blogs')
export class BloggerBlogsController {
  constructor(
    private commandBus: CommandBus,
    private readonly checkService: CheckService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}
  //ready
  @Put(':id')
  @HttpCode(204)
  async updateBlogById(
    @Req() request,
    @Param('id') blogId: string,
    @Body() blogUpdateInputModel: UpdateBlogInputModelType,
  ) {
    const result: ActionResult = await this.commandBus.execute(
      new UpdateBlogByIdFromUriCommand(
        blogId,
        request.user.userId,
        blogUpdateInputModel,
      ),
    );
    handleActionResult(result);
  }
  //ready
  @Delete(':id')
  @HttpCode(204)
  async deleteBlogById(@Req() request, @Param('id') blogId: string) {
    const result = await this.commandBus.execute(
      new DeleteBlogByIdFromUriCommand(blogId, request.user.userId),
    );
    handleActionResult(result);
  }
  //ready

  @Post()
  async createBlog(
    @Req() request,
    @Body() blogCreateInputModel: CreateBlogInputModelType,
  ) {
    const newBlogsId = await this.commandBus.execute(
      new CreateBlogCommand(request.user.userId, blogCreateInputModel),
    );
    const newBlog = await this.blogsQueryRepository.getBlogById(newBlogsId);
    if (!newBlog) {
      throw new UnableException('blog creating');
    }
    return newBlog;
  }

  @Get()
  async getAllBlogsForCurrentUser(
    @Query() queryParams: RequestBlogsQueryModel,
    @Req() request,
  ) {
    const mergedQueryParams = { ...DEFAULT_BLOGS_QUERY_PARAMS, ...queryParams };
    return await this.blogsQueryRepository.getAllBlogsForCurrentUser(
      mergedQueryParams,
      request.user.userId,
    );
  }

  @Post(':id/posts')
  async createPostByBlogsId(
    @Req() request,
    @Param('id') blogId: string,
    @Body() postCreateDto: CreatePostByBlogsIdInputModelType,
  ) {
    const result = await this.commandBus.execute(
      new CreatePostFromBloggerControllerCommand(
        request.user.userId,
        blogId,
        postCreateDto,
      ),
    );
    handleActionResult(result);
    const newPost = await this.postsQueryRepository.getPostById(result);
    if (!newPost) {
      throw new UnableException('post creating');
    }
    return newPost;
  }

  @Put(':blogId/posts/:postId')
  @HttpCode(204)
  async updatePost(
    @Req() request,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() postUpdateDto: UpdatePostByBlogsIdInputModelType,
  ) {
    if (!(await this.checkService.isBlogExist(blogId))) {
      throw new CustomNotFoundException('blog');
    }
    const result: ActionResult = await this.commandBus.execute(
      new UpdatePostByIdFromBloggerControllerCommand(
        request.user.userId,
        blogId,
        postId,
        postUpdateDto,
      ),
    );
    handleActionResult(result);
  }

  @Delete(':blogId/posts/:postId') // FIX:
  @HttpCode(204)
  async deletePost(
    @Req() request,
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    if (!(await this.checkService.isBlogExist(blogId))) {
      throw new CustomNotFoundException('blog');
    }
    const result: ActionResult = await this.commandBus.execute(
      new DeletePostByIdFromUriCommand(request.user.userId, blogId, postId),
    );
    handleActionResult(result);
  }

  //TODO:
  @Get(':blogId/posts')
  @HttpCode(200)
  async getAllPostsForCurrentBlog(
    @Param('blogId') blogId,
    @Query() queryParams: RequestBlogsQueryModel,
  ) {
    const mergedQueryParams = { ...DEFAULT_BLOGS_QUERY_PARAMS, ...queryParams };
  }

  @Get('comments')
  @HttpCode(200)
  async getAllCommentsForAllPostsForAllBlogs(
    @Req() request,
    @Query() queryParams: RequestQueryParamsModel,
  ) {
    const mergedQueryParams = { ...DEFAULT_QUERY_PARAMS, ...queryParams };
    const comments = await this.commentsQueryRepository.getAllCommentForBlogger(
      request.user.userId,
      mergedQueryParams,
    );
    return comments;
  }

  @Post(':blogId/images/wallpapers')
  @UseInterceptors(FileInterceptor('blogWallpaper'))
  @HttpCode(201)
  async setWallpapersForBlog(
    @Req() request,
    @Param('blogId') blogId,
    @UploadedFile() blogWallpaper: Express.Multer.File,
  ){
    console.log("blogWallpaper: Express.Multer.File ", blogWallpaper);
    
  const result = await this.commandBus.execute(
    new BloggerUploadWallpaperForBlogCommand(
      request.user.userId,
      blogId,
    blogWallpaper))
    return result
  }

  //TODO: remove before prod
  @Post(':blogId/test/wallpapers')
  @UseInterceptors(FileInterceptor('blogWallpaper'))
  @HttpCode(201)
  async TestSetWallpaper(
    @Req() request,
    @Param('blogId') blogId,
    @UploadedFile() blogWallpaperFile: Express.Multer.File,
  ){
    console.log("blogWallpaper: Express.Multer.File ", blogWallpaperFile);
    
  const result = await this.commandBus.execute(
    new BloggerUploadWallpaperForBlogCommand(
      request.user.userId,
      blogId,
    blogWallpaperFile))
    return result
  }

}
