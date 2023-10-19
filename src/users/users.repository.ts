import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { UserDBType, Users } from './users.types';
import { PasswordRecoveryModel } from '../auth/auth.types';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { validate as isValidUUID } from 'uuid';
import { log } from 'console';

@Injectable()
export class UsersRepository {
  constructor(
  @InjectDataSource() protected dataSource: DataSource,
  @InjectRepository(Users) private readonly usersRepository: Repository<Users>) {}

  async createUser(userDTO: UserDBType){
    const result = await this.usersRepository.save(userDTO)
    return result.userId
  }

  async getUserForLoginByLoginOrEmail(loginOrEmail: string): Promise<UserDBType | null | undefined>{
    const result = await this.usersRepository.find({
      where: [
        {login: loginOrEmail},
        {email: loginOrEmail}
      ]
    })
    return result[0]
  }

  async deleteUserById(userId: string): Promise<boolean> {
    if (!isValidUUID(userId)) {
      return false;
    }
    const result = await this.usersRepository
    .createQueryBuilder()
    .delete()
    .from(Users)
    .where('userId = :userId', { userId })
    .execute();  

    return result.affected > 0
  }

  async getUserDBTypeById(userId): Promise<UserDBType | null> {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.usersRepository.findOne({
      where: [{ userId: userId }],
    });
    return result
  }

  async addPasswordRecoveryData(
    passwordRecoveryData: PasswordRecoveryModel,
  ): Promise<boolean> {    
    const result = await this.usersRepository.update(
      {email: passwordRecoveryData.email},
      {passwordRecoveryCode: passwordRecoveryData.passwordRecoveryCode,
      expirationDateOfRecoveryCode: passwordRecoveryData.expirationDateOfRecoveryCode}
    )
    return result.affected > 0
  }

  async isPasswordRecoveryCodeExistAndNotExpired(confirmationCode:string): Promise<boolean>{
    const count = await this.usersRepository
    .createQueryBuilder('user')
    .where('user.passwordRecoveryCode = :confirmationCode', { confirmationCode })
    .andWhere('user.expirationDateOfRecoveryCode > :currentDate', { currentDate: new Date() })
    .getCount();

  return count > 0;
  }

  async newPasswordSet(recoveryCode: string, newPasswordHash: string): Promise<boolean> {
    const result = await this.usersRepository.update(
      { passwordRecoveryCode: recoveryCode },
      { passwordHash: newPasswordHash,
        passwordRecoveryCode: null,
        expirationDateOfRecoveryCode: null}
    )   
    return result.affected > 0
  }

  async newPasswordSetRow(recoveryCode: string, newPasswordHash: string): Promise<boolean> {    
    const query = `
  UPDATE public."Users"
  SET "passwordHash" = $2, "passwordRecoveryCode" = null, "expirationDateOfRecoveryCode" = null
  WHERE "passwordRecoveryCode" = $1;
  `;
  try {
    await this.dataSource.query(query, [
      recoveryCode,
      newPasswordHash
    ]);
    return true;
  } catch (error) {
    return false;
  }
  }

  async confirmUser(confirmationCode: string): Promise<boolean>{
    const query = `
    UPDATE public."Users"
    SET "confirmationCode"=null, "expirationDateOfConfirmationCode"=null, "isConfirmed"=true
    WHERE "confirmationCode" = $1;
    `;
    try {
      await this.dataSource.query(query, [
        confirmationCode
      ]);
  
      return true;
    } catch (error) {
      return false;
    }
  }

  async refreshConfirmationData(refreshConfirmationData){
    const query = `
    UPDATE public."Users"
    SET "confirmationCode"=$1, "expirationDateOfConfirmationCode"=$2
    WHERE email = $3;
    `
    try {
      await this.dataSource.query(query, [
        refreshConfirmationData.confirmationCode,
        refreshConfirmationData.expirationDateOfConfirmationCode,
        refreshConfirmationData.email
      ]);
  
      return true;
    } catch (error) {
      return false;
    }
  }

  async changeUserBanStatus(userBanDto): Promise<boolean> {
    if (!isValidUUID(userBanDto.userId)) {
      return false;
    }
    const query = `
    UPDATE public."Users"
    SET "isUserBanned" = $2, "banDate" = $3, "banReason" = $4 
    WHERE "userId" = $1;
    `
    try {
      await this.dataSource.query(query, [
        userBanDto.userId,
        userBanDto.isBanned,
        userBanDto.banDate,
        userBanDto.banReason
      ]);
      return true;
    } catch (error) {
      return false;
    }

  }

  async isEmailExists(email: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { email } });
    return count > 0;
  }

  async isEmailConfirmed(email: string): Promise<boolean> {
    const query = `
      SELECT "isConfirmed"
      FROM public."Users"
      WHERE email = $1
    `;
    const result = await this.dataSource.query(query, [email]);
    return result;
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

  async isPasswordRecoveryCodeExist(passwordRecoveryCode: string): Promise<boolean> {
    const count = await this.usersRepository.count({ where: { passwordRecoveryCode } });
    return count > 0;
  }

  async isConfirmationCodeExistAndNotExpired(confirmationCode:string){
    const query = `
    SELECT COUNT(*) AS count
    FROM public."Users"
    WHERE "confirmationCode" = $1
    AND "expirationDateOfConfirmationCode" > NOW()
  `;
  const result = await this.dataSource.query(query, [confirmationCode]);
  const count = result[0].count;
  return count > 0;
  }

  
  async isEmailAlreadyCofirmed(email: string): Promise<boolean>{
    const query = `
    SELECT "isConfirmed"
    FROM public."Users"
    WHERE email=$1
    LIMIT 1
    `
  const result = await this.dataSource.query(query, [email]);
  if (result.length > 0) {
    const isConfirmed = result[0].isConfirmed;
    return isConfirmed;
  }
  return false;   
  }

  async isUserBanned(userId): Promise<boolean>{
    if (!isValidUUID(userId)) {
      return false;
    }
    const query = `
    SELECT "isUserBanned"
    FROM public."Users"
    WHERE "userId"=$1
    LIMIT 1
    `
    const isUserBanned = await this.dataSource.query(query, [userId]);
    return isUserBanned[0].isUserBanned
  }

  async getConfirmationCodeOfLastCreatedUser(){
    const result = await this.dataSource.query(`SELECT "confirmationCode"
FROM "Users"
ORDER BY "createdAt" DESC
LIMIT 1;`)
return result[0];
    }

  async getLastCreatedUserDbType(){
    const result = await this.dataSource.query(`SELECT *
  FROM "Users"
  ORDER BY "createdAt" DESC
  LIMIT 1;`)
  return result[0];
      }
  
}
