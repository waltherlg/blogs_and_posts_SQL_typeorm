import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserDBType } from './users.types';
import { PasswordRecoveryModel } from '../auth/auth.types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { Users } from './user.entity';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(Users)
    private readonly usersRepository: Repository<Users>,
  ) {}

  async createUser(userDTO: UserDBType) {
    const result = await this.usersRepository.save(userDTO);
    return result.userId;
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
    const result = await this.usersRepository.delete(userId)
    return result.affected > 0;
  }

  async getUserDBTypeById(userId): Promise<UserDBType | null> {
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
    console.log(user.login)
    if(user){
      return user.login
    } else {
      return null
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
