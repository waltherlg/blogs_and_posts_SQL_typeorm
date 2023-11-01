import { Injectable } from '@nestjs/common';
import {
  BannedBlogUsersType,
  BlogBannedUsers,
  BlogDBType,
  BlogTypeOutput,
  Blogs,
} from '../blogs.types';
import { DataSource, Repository } from 'typeorm';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';

@Injectable()
export class BlogsRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Blogs)
    private readonly blogsRepository: Repository<Blogs>,
    @InjectRepository(BlogBannedUsers)
    private readonly blogBannedUsersRepository: Repository<BlogBannedUsers>,
  ) {}

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
    const result = await this.blogsRepository.save(blogDTO);
    return result.blogId;
  }

  async getBlogDBTypeById(blogId): Promise<BlogDBType | null> {
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
      {blogId: blogId},
      {
        name: name,
        description: description, 
        websiteUrl: websiteUrl
      }
    );
    return result.affected > 0;
  }

  async bindBlogWithUser(blogId, userId) {
    if (!isValidUUID(blogId) || !isValidUUID(userId)) {
      return false;
    }
    const result = await this.blogsRepository.update(
      { blogId: blogId },
      { userId: userId }
    )
    return result.affected > 0;
  }

  async isBlogExist(blogId): Promise<boolean> {
    if (!isValidUUID(blogId)) {
      return false;
    }
    const query = `
    SELECT COUNT(*) AS count
    FROM public."Blogs"
    WHERE "blogId" = $1
    `;
    const result = await this.dataSource.query(query, [blogId]);
    const count = result[0].count;
    return count > 0;
  }

  async newBanStatus(
    blogId,
    newBanStatus: boolean,
    newBanDate,
  ): Promise<boolean> {
    if (!isValidUUID(blogId)) {
      return false;
    }
    const query = `
    UPDATE public."Blogs"
    SET "isBlogBanned" = $2, "blogBanDate" = $3
    WHERE "blogId" = $1
    `;
    const result = await this.dataSource.query(query, [
      blogId,
      newBanStatus,
      newBanDate,
    ]);
    const count = result[1];
    return count === 1;
  }

  // check is user banned for that blog or not
  async isUserBannedForBlog(blogId, userId) {
    if (!isValidUUID(blogId) || !isValidUUID(userId)) {
      return false;
    }
    const query = `
    SELECT COUNT(*) AS count
    FROM public."BlogBannedUsers"
    WHERE "blogId" = $1 AND "userId" = $2
    `;
    const result = await this.dataSource.query(query, [blogId, userId]);
    const count = result[0].count;
    return count > 0;
  }

  async addUserToBlogBanList(
    banUserInfo: BannedBlogUsersType,
  ): Promise<boolean> {
    const query = `
    INSERT INTO public."BlogBannedUsers"(
      "blogId",
      "userId",
      "banDate",
      "banReason")
      VALUES (
      $1,  
      $2, 
      $3, 
      $4
      )
      RETURNING 'User added to ban list.' as confirmation;
    `;
    const result = await this.dataSource.query(query, [
      banUserInfo.blogId,
      banUserInfo.userId,
      banUserInfo.banDate,
      banUserInfo.banReason,
    ]);
    const confirmationMessage = result[0].confirmation;
    if (confirmationMessage) {
      return true;
    } else {
      return false;
    }
  }

  async removeUserFromBlogBanList(blogId, userId): Promise<boolean> {
    if (!isValidUUID(blogId) || !isValidUUID(userId)) {
      return false;
    }
    const query = `
    DELETE FROM public."BlogBannedUsers"
    WHERE "blogId" = $1 AND "userId" = $2
    `;
    const result = await this.dataSource.query(query, [blogId, userId]);
    return result[1] > 0;
  }
}
