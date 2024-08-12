import { Injectable } from '@nestjs/common';
import {
  BannedBlogUsersType,
  BlogDBType,
  BlogTypeOutput,
} from '../blogs.types';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { BlogBannedUsers, Blogs } from '../blog.entity';
import {
  BlogMainImage,
  BlogMainImageDto,
  BlogWallpaperImage,
  BlogWallpaperImageDto,
} from '../blog.image.type';
import { BlogSubscribers } from '../blog.subscriber.types';
import { Users } from '../../users/user.entity';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
    @InjectRepository(BlogBannedUsers)
    private readonly blogBannedUsersRepository: Repository<BlogBannedUsers>,
    @InjectRepository(BlogWallpaperImage)
    private readonly blogWallpaperImageRepository: Repository<BlogWallpaperImage>,
    @InjectRepository(BlogMainImage)
    private readonly blogMainImageRepository: Repository<BlogMainImage>,
  ) {}

  async saveBlog(blog: Blogs) {
    try {
      await this.blogsRepository.save(blog);
      return true;
    } catch (error) {
      return false;
    }
  }

  async deleteBlogById(blogId: string): Promise<boolean> {
    if (!isValidUUID(blogId)) {
      return false;
    }
    const result = await this.blogsRepository
      .createQueryBuilder()
      .delete()
      .from(Blogs)
      .where('blogId = :blogId', { blogId })
      .execute();

    return result.affected > 0;
  }

  async createBlog(blogDTO: BlogDBType): Promise<string> {
    const resultBlogSave = await this.blogsRepository.save(blogDTO);

    const blogWallpaper = new BlogWallpaperImageDto(blogDTO.blogId);
    const blogWallpaperResult = await this.blogWallpaperImageRepository.save(
      blogWallpaper,
    );

    const blogMain = new BlogMainImageDto(blogDTO.blogId);
    const blogMainResult = await this.blogMainImageRepository.save(blogMain);

    return resultBlogSave.blogId;
  }

  async getBlogDBTypeById(blogId): Promise<Blogs | null> {
    if (!isValidUUID(blogId)) {
      return null;
    }
    const result = await this.blogsRepository.findOne({
      where: [{ blogId: blogId }],
    });
    return result;
  }

  async updateBlogById(
    blogId,
    name,
    description,
    websiteUrl,
  ): Promise<boolean> {
    if (!isValidUUID(blogId)) {
      return false;
    }
    const result = await this.blogsRepository.update(
      { blogId: blogId },
      {
        name: name,
        description: description,
        websiteUrl: websiteUrl,
      },
    );
    return result.affected > 0;
  }

  async bindBlogWithUser(blogId, userId) {
    if (!isValidUUID(blogId) || !isValidUUID(userId)) {
      return false;
    }
    const result = await this.blogsRepository.update(
      { blogId: blogId },
      { userId: userId },
    );
    return result.affected > 0;
  }

  async isBlogExist(blogId): Promise<boolean> {
    if (!isValidUUID(blogId)) {
      return false;
    }
    const result = await this.blogsRepository.count({ where: { blogId } });
    return result > 0;
  }

  async newBanStatus(blogId, newBanStatus, newBanDate): Promise<boolean> {
    if (!isValidUUID(blogId)) {
      return false;
    }
    const result = await this.blogsRepository.update(
      { blogId: blogId },
      {
        isBlogBanned: newBanStatus,
        blogBanDate: newBanDate,
      },
    );
    return result.affected > 0;
  }

  async isUserBannedForBlog(blogId, userId) {
    if (!isValidUUID(blogId) || !isValidUUID(userId)) {
      return false;
    }
    const result = await this.blogBannedUsersRepository.count({
      where: { blogId, userId },
    });
    return result > 0;
  }

  async addUserToBlogBanList(
    banUserInfo: BannedBlogUsersType,
  ): Promise<boolean> {
    const result = await this.blogBannedUsersRepository.save(banUserInfo);
    if (result.userId) {
      return true;
    } else {
      return false;
    }
  }

  async removeUserFromBlogBanList(blogId, userId): Promise<boolean> {
    if (!isValidUUID(blogId) || !isValidUUID(userId)) {
      return false;
    }
    const result = await this.blogBannedUsersRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId: userId })
      .andWhere('blogId = :blogId', { blogId: blogId })
      .execute();
    return result.affected > 0;
  }

  async getSubscribersTelegramIds(blogId): Promise<null | Array<any>> {
    if (!isValidUUID(blogId)) {
      return null;
    }
    const blog: Blogs = await this.blogsRepository.findOne({
      where: [{ blogId: blogId }],
      relations: ['BlogSubscribers.Users'],
    });

    if (!blog) return null;

    const subs: BlogSubscribers[] = blog.BlogSubscribers.filter((sub) => sub.isSubscribe === true);

    const telegramIdArr = subs.reduce((ids, sub) => {
      if (sub.Users.telegramId !== null) {
        ids.push(sub.Users.telegramId);
      }
      return ids;
    }, []);

    return telegramIdArr;
  }
}
