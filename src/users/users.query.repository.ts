import { Injectable } from '@nestjs/common';
import {
  NewCreatedUserTypeOutput,
  UserTypeOutput,
  UserTypeOutputForSa,
} from './users.types';
import {
  PaginationOutputModel,
  RequestBannedUsersQueryModel,
} from '../models/types';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { sortDirectionFixer } from '../helpers/helpers.functions';
import { BlogBannedUsers } from '../blogs/blog.entity';
import { Users } from './user.entity';

@Injectable()
export class UsersQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(BlogBannedUsers)
    private readonly blogBannedUsersRepository: Repository<BlogBannedUsers>,
  ) {}

  async getCurrentUserInfo(userId: string) {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.usersRepository.find({
      select: {
        email: true,
        login: true,
        userId: true,
      },
      where: { userId },
    });
    return result[0];
  }

  async getUserById(userId): Promise<UserTypeOutput | null> {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.usersRepository.find({
      select: {
        userId: true,
        login: true,
        email: true,
        createdAt: true,
        isUserBanned: true,
        banDate: true,
        banReason: true,
      },
      where: { userId },
    });
    const user = result[0];
    return {
      id: user.userId,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
      banInfo: {
        isBanned: user.isUserBanned,
        banDate: user.banDate,
        banReason: user.banReason,
      },
    };
  }

  async getNewCreatedUserById(
    userId,
  ): Promise<NewCreatedUserTypeOutput | null> {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.usersRepository.find({
      select: {
        userId: true,
        login: true,
        email: true,
        createdAt: true,
      },
      where: { userId },
    });
    const user = result[0];
    return {
      id: user.userId,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  async getAllUsers(
    mergedQueryParams,
  ): Promise<PaginationOutputModel<UserTypeOutput>> {
    const searchLoginTerm = mergedQueryParams.searchLoginTerm;
    const searchEmailTerm = mergedQueryParams.searchEmailTerm;
    const banStatus = mergedQueryParams.banStatus;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.select([
      'user.userId',
      'user.login',
      'user.email',
      'user.createdAt',
      'user.isUserBanned',
      'user.banDate',
      'user.banReason',
    ]);

    if (searchLoginTerm !== '' || searchEmailTerm !== '') {
      if (searchLoginTerm !== '') {
        queryBuilder.where(`user.login ILIKE :searchLoginTerm`, {
          searchLoginTerm: `%${searchLoginTerm}%`,
        });
      }
      if (searchEmailTerm !== '') {
        queryBuilder.orWhere(`user.email ILIKE :searchEmailTerm`, {
          searchEmailTerm: `%${searchEmailTerm}%`,
        });
      }
    }

    if (
      (searchLoginTerm !== '' || searchEmailTerm !== '') &&
      banStatus !== 'all'
    ) {
      if (banStatus === 'banned') {
        queryBuilder.andWhere(`user.isUserBanned = true`);
      }
      if (banStatus === 'notBanned') {
        queryBuilder.andWhere(`user.isUserBanned = false`);
      }
    }

    if (
      searchLoginTerm === '' &&
      searchEmailTerm === '' &&
      banStatus !== 'all'
    ) {
      if (banStatus === 'banned') {
        queryBuilder.where(`user.isUserBanned = true`);
      }
      if (banStatus === 'notBanned') {
        queryBuilder.where(`user.isUserBanned = false`);
      }
    }

    const [users, usersCount] = await queryBuilder
      .orderBy(`user.${sortBy}`, sortDirection)
      .skip(skipPage)
      .take(pageSize)
      .getManyAndCount();

    const outUsers = users.map((user) => {
      return {
        id: user.userId,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
        banInfo: {
          isBanned: user.isUserBanned,
          banDate: user.banDate,
          banReason: user.banReason,
        },
      };
    });

    const pageCount = Math.ceil(usersCount / pageSize);

    const outputUsers: PaginationOutputModel<UserTypeOutput> = {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: usersCount,
      items: outUsers,
    };

    return outputUsers;
  }

  async getAllUsersForSa(
    mergedQueryParams,
  ): Promise<PaginationOutputModel<UserTypeOutputForSa>> {
    const searchLoginTerm = mergedQueryParams.searchLoginTerm;
    const searchEmailTerm = mergedQueryParams.searchEmailTerm;
    const banStatus = mergedQueryParams.banStatus;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder.select([
      'user.userId',
      'user.login',
      'user.email',
      'user.createdAt',
    ]);

    if (searchLoginTerm !== '' || searchEmailTerm !== '') {
      if (searchLoginTerm !== '') {
        queryBuilder.where(`user.login ILIKE :searchLoginTerm`, {
          searchLoginTerm: `%${searchLoginTerm}%`,
        });
      }
      if (searchEmailTerm !== '') {
        queryBuilder.orWhere(`user.email ILIKE :searchEmailTerm`, {
          searchEmailTerm: `%${searchEmailTerm}%`,
        });
      }
    }

    if (
      (searchLoginTerm !== '' || searchEmailTerm !== '') &&
      banStatus !== 'all'
    ) {
      if (banStatus === 'banned') {
        queryBuilder.andWhere(`user.isUserBanned = true`);
      }
      if (banStatus === 'notBanned') {
        queryBuilder.andWhere(`user.isUserBanned = false`);
      }
    }

    if (
      searchLoginTerm === '' &&
      searchEmailTerm === '' &&
      banStatus !== 'all'
    ) {
      if (banStatus === 'banned') {
        queryBuilder.where(`user.isUserBanned = true`);
      }
      if (banStatus === 'notBanned') {
        queryBuilder.where(`user.isUserBanned = false`);
      }
    }

    const [users, usersCount] = await queryBuilder
      .orderBy(`user.${sortBy}`, sortDirection)
      // .skip(skipPage)
      // .take(pageSize)
      .limit(pageSize)
      .offset(skipPage)
      .getManyAndCount();

    const outUsers = users.map((user) => {
      return {
        id: user.userId,
        login: user.login,
        email: user.email,
        createdAt: user.createdAt,
      };
    });

    const pageCount = Math.ceil(usersCount / pageSize);

    const outputUsers: PaginationOutputModel<UserTypeOutputForSa> = {
      pagesCount: pageCount,
      page: pageNumber,
      pageSize: pageSize,
      totalCount: usersCount,
      items: outUsers,
    };

    return outputUsers;
  }

  async getBannedUsersForCurrentBlog(
    blogId: string,
    mergedQueryParams: RequestBannedUsersQueryModel,
  ) {
    const searchLoginTerm = mergedQueryParams.searchLoginTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder =
      this.blogBannedUsersRepository.createQueryBuilder('blogBannedUsers');
    queryBuilder
      .leftJoin('blogBannedUsers.Users', 'user')
      .select('blogBannedUsers.userId', 'userId')
      .addSelect('user.login', 'login')
      .addSelect('blogBannedUsers.banDate', 'banDate')
      .addSelect('blogBannedUsers.banReason', 'banReason')
      .where('blogBannedUsers.blogId = :blogId', { blogId: blogId });

    if (searchLoginTerm !== '') {
      queryBuilder.andWhere('user.login ILIKE :searchLoginTerm', {
        searchLoginTerm: `%${searchLoginTerm}%`,
      });
    }

    const bannedUsersCount = await queryBuilder.getCount();

    const bannedUsers = await queryBuilder
      .orderBy(`"${sortBy}"`, sortDirection)
      .take(pageSize)
      .skip(skipPage)
      .limit(pageSize)
      .offset(skipPage)
      .getRawMany();

    const bannedUsersForOutput = bannedUsers.map((bannedUser) => {
      return {
        id: bannedUser.userId,
        //login: bannedUser.login,
        banInfo: {
          isBanned: true,
          banDate: bannedUser.banDate,
          banReason: bannedUser.banReason,
        },
      };
    });

    const pageCount = Math.ceil(bannedUsersCount / pageSize);

    const outputBannedUsers = {
      pagesCount: pageCount,
      page: +pageNumber,
      pageSize: +pageSize,
      totalCount: bannedUsersCount,
      items: bannedUsersForOutput,
    };
    return outputBannedUsers;
  }
}
