import { Injectable } from '@nestjs/common';
import { NewCreatedUserTypeOutput, UserTypeOutput, Users } from './users.types';
import {
  PaginationOutputModel,
  RequestBannedUsersQueryModel,
} from '../models/types';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { sortDirectionFixer } from 'src/helpers/helpers.functions';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,) {}

  async getCurrentUserInfo(userId: string) {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.usersRepository.find({
      select: {
        email: true,
        login: true,
        userId: true
      },
      where: {userId}
    })
    return result[0]
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
      where: {userId}
    })
    const user = result[0]
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
        createdAt: true
      },
      where: {userId}
    })
    const user = result[0];
    return {
      id: user.userId,
      login: user.login,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

   async getAllUsers(mergedQueryParams): Promise<PaginationOutputModel<UserTypeOutput>> {
    const searchLoginTerm = mergedQueryParams.searchLoginTerm;
    const searchEmailTerm = mergedQueryParams.searchEmailTerm;
    const banStatus = mergedQueryParams.banStatus;
    const sortBy = mergedQueryParams.sortBy ;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection) ;    
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryBuilder = this.usersRepository.createQueryBuilder('user');
    queryBuilder
      .select([
        'user.userId',
        'user.login',
        'user.email',
        'user.createdAt',
        'user.isUserBanned',
        'user.banDate',
        'user.banReason',
      ])

      
      if (searchLoginTerm !== '' || searchEmailTerm !== '') {
        if(searchLoginTerm !== ''){
          queryBuilder.where(`user.login ILIKE :searchLoginTerm`, { searchLoginTerm: `%${searchLoginTerm}%` })
        }      
        if(searchEmailTerm !== ''){
          queryBuilder.where(`user.email ILIKE :searchEmailTerm`, { searchEmailTerm: `%${searchEmailTerm}%` })
        }
      }

      if ((searchLoginTerm !== '' || searchEmailTerm !== '') && banStatus !== 'all'){
        if(banStatus === 'banned'){
          queryBuilder.andWhere(`user.isUserBanned = true`)
        }
        if(banStatus === 'notBanned'){
          queryBuilder.andWhere(`user.isUserBanned = false`)
        }
      }

      if (searchLoginTerm === '' && searchEmailTerm === '' && banStatus !== 'all'){
        if(banStatus === 'banned'){
          queryBuilder.where(`user.isUserBanned = true`)
        }
        if(banStatus === 'notBanned'){
          queryBuilder.where(`user.isUserBanned = false`)
        }
      }

      const usersCount = await queryBuilder.getCount();
      const users = await queryBuilder      
      .orderBy(`user.${sortBy}`, sortDirection)
      .skip(skipPage)
      .take(pageSize)
      .getMany();
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

  async getBannedUsersForCurrentBlogRow(
    blogId: string,
    mergedQueryParams: RequestBannedUsersQueryModel,
  ) {
    const searchLoginTerm = mergedQueryParams.searchLoginTerm;
    const sortBy = mergedQueryParams.sortBy;
    const sortDirection = sortDirectionFixer(mergedQueryParams.sortDirection);
    const pageNumber = +mergedQueryParams.pageNumber;
    const pageSize = +mergedQueryParams.pageSize;
    const skipPage = (pageNumber - 1) * pageSize;

    const queryParams = [
      `%${searchLoginTerm}%`,
      sortBy,
      sortDirection,
      pageNumber,
      pageSize,
      skipPage,
      blogId,
    ];

    let query = `
    SELECT "BlogBannedUsers".*, "Users".login
    FROM public."BlogBannedUsers"
    INNER JOIN "Users"
    ON "BlogBannedUsers"."bannedUserId" = "Users"."userId"
    WHERE "blogId" = '${queryParams[6]}'
    `;
    let countQuery = `
    SELECT COUNT(*)
    FROM public."BlogBannedUsers"
    INNER JOIN "Users"
    ON "BlogBannedUsers"."bannedUserId" = "Users"."userId"
    WHERE "blogId" = '${queryParams[6]}'
    `;
    if (searchLoginTerm !== '') {
      query += `AND login ILIKE '${queryParams[0]}'`;
      countQuery += `AND login ILIKE '${queryParams[0]}'`;
    }

    query += ` ORDER BY "${queryParams[1]}" ${queryParams[2]}
    LIMIT ${queryParams[4]} OFFSET ${queryParams[5]};
    `;

    const bannedUsersCountArr = await this.dataSource.query(countQuery);
    const bannedUsersCount = parseInt(bannedUsersCountArr[0].count);

    const bannedUsers = await this.dataSource.query(query);

    const bannedUsersForOutput = bannedUsers.map((user) => {
      return {
        id: user.bannedUserId,
        login: user.login,
        banInfo: {
          isBanned: true,
          banDate: user.banDate,
          banReason: user.banReason,
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
