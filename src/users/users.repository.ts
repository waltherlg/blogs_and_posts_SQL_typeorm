import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserDBType } from './users.types';
import { PasswordRecoveryModel } from '../auth/auth.types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { Users } from './user.entity';
import { PlayerDtoType } from '../quizGame/quiz.game.types';
import { userMapper } from './helpers/user.mapper';
import { CommentLikes, PostLikes } from 'src/likes/like.entity';
import { Posts } from 'src/posts/post.entity';
import { Comments } from 'src/comments/comment.entity';
import { UserDevices } from 'src/usersDevices/user.device.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
    @InjectRepository(PostLikes)
    private readonly postLikesRepository: Repository<PostLikes>,
    @InjectRepository(Posts)
    private readonly postsRepository: Repository<Posts>,
    @InjectRepository(CommentLikes)
    private readonly commentLikesRepository: Repository<CommentLikes>,
    @InjectRepository(Comments)
    private readonly commentsRepository: Repository<Comments>,
    @InjectRepository(UserDevices)
    private readonly userDevicesRepository: Repository<UserDevices>,
  ) {}

  // async createUser(userDTO: UserDBType) {
  //   const result = await this.usersRepository.save(userDTO);
  //   return result.userId;
  // }

  async createUser(userDTO: Users) {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const result = await queryRunner.manager.save(userDTO);
      await queryRunner.commitTransaction();
      return result.userId;
    } catch (e) {
      await queryRunner.rollbackTransaction();
      throw e;
    } finally {
      await queryRunner.release();
    }
  }

  async getUserForLoginByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDBType | null | undefined> {
    const result = await this.usersRepository.find({
      where: [{ login: loginOrEmail }, { email: loginOrEmail }],
    });
    return result[0];
  }

  async deleteUserById(userId: string): Promise<boolean> {
    if (!isValidUUID(userId)) {
      return false;
    }
    const result = await this.usersRepository.delete(userId);
    return result.affected > 0;
  }

  async getUserDBTypeById(userId): Promise<Users | null> {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.usersRepository.findOne({
      where: [{ userId: userId }],
    });
    return result;
  }

  async addPasswordRecoveryData(
    passwordRecoveryData: PasswordRecoveryModel,
  ): Promise<boolean> {
    const result = await this.usersRepository.update(
      { email: passwordRecoveryData.email },
      {
        passwordRecoveryCode: passwordRecoveryData.passwordRecoveryCode,
        expirationDateOfRecoveryCode:
          passwordRecoveryData.expirationDateOfRecoveryCode,
      },
    );
    return result.affected > 0;
  }

  async isPasswordRecoveryCodeExistAndNotExpired(
    confirmationCode: string,
  ): Promise<boolean> {
    const count = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.passwordRecoveryCode = :confirmationCode', {
        confirmationCode,
      })
      .andWhere('user.expirationDateOfRecoveryCode > :currentDate', {
        currentDate: new Date(),
      })
      .getCount();

    return count > 0;
  }

  async isConfirmationCodeExistAndNotExpired(confirmationCode: string) {
    const count = await this.usersRepository
      .createQueryBuilder('user')
      .where('user.confirmationCode = :confirmationCode', {
        confirmationCode,
      })
      .andWhere('user.expirationDateOfConfirmationCode > :currentDate', {
        currentDate: new Date(),
      })
      .getCount();
    return count > 0;
  }

  async newPasswordSet(
    recoveryCode: string,
    newPasswordHash: string,
  ): Promise<boolean> {
    const result = await this.usersRepository.update(
      { passwordRecoveryCode: recoveryCode },
      {
        passwordHash: newPasswordHash,
        passwordRecoveryCode: null,
        expirationDateOfRecoveryCode: null,
      },
    );
    return result.affected > 0;
  }

  async confirmUser(confirmationCode: string): Promise<boolean> {
    const result = await this.usersRepository.update(
      { confirmationCode: confirmationCode },
      {
        confirmationCode: null,
        expirationDateOfConfirmationCode: null,
        isConfirmed: true,
      },
    );
    return result.affected > 0;
  }

  async refreshConfirmationData(refreshConfirmationData) {
    const result = await this.usersRepository.update(
      { email: refreshConfirmationData.email },
      {
        confirmationCode: refreshConfirmationData.confirmationCode,
        expirationDateOfConfirmationCode:
          refreshConfirmationData.expirationDateOfConfirmationCode,
      },
    );
    return result.affected > 0;
  }

//TODO: remove if not need
  async changeUserBanStatus(userBanDto): Promise<boolean> {
    if (!isValidUUID(userBanDto.userId)) {
      return false;
    }
    const result = await this.usersRepository.update(
      { userId: userBanDto.userId },
      {
        isUserBanned: userBanDto.isBanned,
        banDate: userBanDto.banDate,
        banReason: userBanDto.banReason,
      },
    );
    return result.affected > 0;
  }

  async banChangeUserWithRecountLikes(userBanDto) {
    const userId = userBanDto.userId;
    if (!isValidUUID(userId)) {
      return null;
    }
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (userBanDto.isBanned === true) {
        const resultOfDeletingDevices = await this.userDevicesRepository.delete(
          { userId },
        );
      }

      const banResult = await this.usersRepository.update(
        { userId: userBanDto.userId },
        {
          isUserBanned: userBanDto.isBanned,
          banDate: userBanDto.banDate,
          banReason: userBanDto.banReason,
        },
      );

      const postLikeQueryBuilder =
        this.postLikesRepository.createQueryBuilder('postLike');
      postLikeQueryBuilder
        .select('postLike.postId', 'postId')
        .where('postLike.userId = :userId', { userId: userId });
      const postIdArray = await postLikeQueryBuilder.getMany();

      if (postIdArray.length > 0) {
        const postIds = postIdArray.map((obj) => obj.postId);
        //get all likes for posts by postIds array for recount
        const postLikesArrQB = this.postLikesRepository
          .createQueryBuilder('postLike')
          .leftJoin('postLike.Users', 'user')
          .where('user.isUserBanned = false')
          .andWhere('postLike.postId IN (:...postIds)', {
            postIds: postIds,
          });
        const postLikesArr: PostLikes[] = await postLikesArrQB.getMany();
        const postStats = postLikesArr.reduce((acc, post) => {
          const { postId, status } = post;
          if (!acc[postId]) {
            acc[postId] = { Like: 0, Dislike: 0, None: 0 };
          }
          acc[postId][status]++;
          return acc;
        }, {});
        
        const postQueryBuilder = this.postsRepository
          .createQueryBuilder('post')
          .where('post.postId IN (:...postIds)', {
            postIds: postIds,
          });
        const postsArr = await postQueryBuilder.getMany();
        
        const updatedPosts = postsArr.map((post) => {
          post.likesCount = postStats[post.postId].Like;
          post.dislikesCount = postStats[post.postId].Dislike;
          return post;
        });
        
        const isPostsUpdated = await this.postsRepository.save(updatedPosts);
      }

      // перерасчет количества лайков разделен на этапы:
      //1-й - мы достаем массив айдишек тех Комментов,
      // где что то ставил забаненый или разбаненый пользователь это commentIdArray.
      // То ест достаем коммент айди из комментлайков
      //2-й - мы достаем массив ВСЕХ комменталайков на основе массива комментАйди,
      // ВСЕХ, потому что нам надо пересчитать ВСЕ лайки в этих комментах
      // но на этот раз массив где пользователь НЕ ЗАБАНЕН, потому что,
      // НАМ нужно пересчитать лайки только от НЕЗАБАНЕНЫХ пользователей.
      // 3-й Мы достаем из БД все комменты, на основе массива комментайдис
      // мапим сущности комментов, выставляя новые количества лайков и дизлаков
      // сохранаяем сущности.
      const commentLikeQueryBuilder =
        this.commentLikesRepository.createQueryBuilder('commentLike');
      commentLikeQueryBuilder
        .select('commentLike.commentId', 'commentId')
        .where('commentLike.userId = :userId', { userId: userId });
      const commentIdArray = await commentLikeQueryBuilder.getRawMany();

      if (commentIdArray.length > 0) {
        const commentIds = commentIdArray.map((obj) => obj.commentId);
        const commentLikesArrQB = this.commentLikesRepository
          .createQueryBuilder('commentLike')
          .leftJoin('commentLike.Users', 'user')
          .where('user.isUserBanned = false')
          .andWhere('commentLike.commentId IN (:...commentIds)', {
            commentIds: commentIds,
          });
        // достаем все лайки к комментам по коментАйди
        const commentLikesArr: CommentLikes[] =
          await commentLikesArrQB.getMany();
        const commentStats = commentLikesArr.reduce((acc, comment) => {
          const { commentId, status } = comment;
          if (!acc[commentId]) {
            acc[commentId] = { Like: 0, Dislike: 0, None: 0 };
          }
          acc[commentId][status]++;
          return acc;
        }, {});
        // Нужно достать все комменты с коммент айди.
        const commentQueryBuilder = this.commentsRepository
          .createQueryBuilder('comment')
          .where('comment.commentId IN (:...commentIds)', {
            commentIds: commentIds,
          });
        const commentsArr = await commentQueryBuilder.getMany();
        const updatedComments = commentsArr.map((comment) => {
          comment.likesCount = commentStats[comment.commentId].Like;
          comment.dislikesCount = commentStats[comment.commentId].Dislike;
          return comment;
        });
        const isCommentsUpdated = await this.commentsRepository.save(
          updatedComments,
        );
      }

      await queryRunner.commitTransaction();
      return true;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      //TODO: remove before prod
      console.log(error);
      return false;
    } finally {
      await queryRunner.release();
    }
  }

  async isEmailExists(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { email } });
    return count > 0;
  }

  async isLoginExists(login: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { login } });
    return count > 0;
  }

  async isUserIdExist(userId: string): Promise<boolean> {
    if (!isValidUUID(userId)) {
      return false;
    }
    const count = await this.usersRepository.count({ where: { userId } });
    return count > 0;
  }

  async isPasswordRecoveryCodeExist(
    passwordRecoveryCode: string,
  ): Promise<boolean> {
    const count = await this.usersRepository.count({
      where: { passwordRecoveryCode },
    });
    return count > 0;
  }

  async isEmailAlreadyCofirmed(email: string): Promise<boolean> {
    const result = await this.usersRepository.find({
      select: {
        isConfirmed: true,
      },
      where: { email },
    });
    if (result.length > 0) {
      const isConfirmed = result[0].isConfirmed;
      return isConfirmed;
    }
    return false;
  }

  async isUserBanned(userId): Promise<boolean> {
    if (!isValidUUID(userId)) {
      return false;
    }
    const result = await this.usersRepository.find({
      select: {
        isUserBanned: true,
      },
      where: { userId },
    });
    if (result.length > 0) {
      const isUserBanned = result[0].isConfirmed;
      return isUserBanned;
    }
    return false;
  }

  async getUserLoginById(userId): Promise<string | null> {
    const user = await this.usersRepository.findOne({
      select: {
        login: true,
      },
      where: { userId },
    });
    if (user) {
      return user.login;
    } else {
      return null;
    }
  }

  async getUserForGame(userId): Promise<PlayerDtoType | null> {
    const user = await this.usersRepository.findOne({
      select: {
        userId: true,
        login: true,
      },
      where: { userId },
    });
    if (user) {
      return userMapper.returnForGame(user);
    } else {
      return null;
    }
  }

  async getConfirmationCodeOfLastCreatedUser() {
    const result = await this.dataSource.query(`SELECT "confirmationCode"
FROM "Users"
ORDER BY "createdAt" DESC
LIMIT 1;`);
    return result[0];
  }

  async getLastCreatedUserDbType() {
    const result = await this.dataSource.query(`SELECT *
  FROM "Users"
  ORDER BY "createdAt" DESC
  LIMIT 1;`);
    return result[0];
  }
}
