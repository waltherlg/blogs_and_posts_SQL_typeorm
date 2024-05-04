import { UserDBType } from '../users/users.types';
import { BcryptService } from '../other.services/bcrypt.service';
import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { Users } from 'src/users/user.entity';
import { PlayerStatistic } from '../quizGame/quiz.game.statistic.type';

@Injectable()
export class DTOFactory {
  constructor(private readonly bcryptService: BcryptService) {}

  // async createUserDTO(createUserData: createUserDataType) {
  //   const passwordHash = await this.bcryptService.hashPassword(
  //     createUserData.password,
  //   );
  //   const userDTO = new UserDBType(
  //     uuidv4(),
  //     createUserData.login,
  //     passwordHash,
  //     createUserData.email,
  //     new Date().toISOString(),
  //     false,
  //     null,
  //     null,
  //     createUserData.confirmationCode || null,
  //     createUserData.expirationDateOfConfirmationCode || null,
  //     createUserData.isConfirmed || false,
  //     null,
  //     null,
  //   );
  //   return userDTO;
  // }

  //TODO: спросить, можно ли создавать сущность энтити и спользовать ее как дто?
  async createUserEntity(createUserData: createUserDataType) {
    const passwordHash = await this.bcryptService.hashPassword(
      createUserData.password,
    );
    const userId = uuidv4();
    const playerStatisticEntity: PlayerStatistic = new PlayerStatistic(
      userId,
      0,
      0,
      0,
      0,
      0,
      0,
    );

    const userEntity: Users = new Users(
      userId,
      createUserData.login,
      passwordHash,
      createUserData.email,
      new Date().toISOString(),
      false,
      null,
      null,
      createUserData.confirmationCode || null,
      createUserData.expirationDateOfConfirmationCode || null,
      createUserData.isConfirmed || false,
      null,
      null,
      playerStatisticEntity,
    );
    return userEntity;
  }
}

type createUserDataType = {
  login: string;
  password: string;
  email: string;
  isConfirmed?: boolean;
  confirmationCode?: string;
  expirationDateOfConfirmationCode?: Date;
};
