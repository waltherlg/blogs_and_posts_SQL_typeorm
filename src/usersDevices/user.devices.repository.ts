import { Injectable, Query } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { UserDevices } from './user.device.entity';

@Injectable()
export class UsersDevicesRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UserDevices)
    private readonly userDevicesRepository: Repository<UserDevices>,
  ) {}

  async addDeviceInfo(deviceInfoDTO): Promise<boolean> {
    const result = await this.userDevicesRepository.save(deviceInfoDTO);
    return result.deviceId;
  }

  async getDeviceByUsersAndDeviceId(userId: string, deviceId: string) {
    if (!isValidUUID(userId) || !isValidUUID(deviceId)) {
      return null;
    }
    const device = await this.userDevicesRepository.findOne({
      where: { userId, deviceId },
    });
    return device;
  }

  async refreshDeviceInfo(
    deviceId,
    lastActiveDate,
    expirationDate,
  ): Promise<boolean> {
    if (!isValidUUID(deviceId)) {
      return false;
    }
    const result = await this.userDevicesRepository.update(
      { deviceId },
      { lastActiveDate, expirationDate },
    );
    return result.affected > 0;
  }

  async deleteDeviceByUserAndDeviceId(userId, deviceId): Promise<boolean> {
    if (!isValidUUID(userId) || !isValidUUID(deviceId)) {
      return false;
    }
    const result = await this.userDevicesRepository
      .createQueryBuilder()
      .delete()
      .from(UserDevices)
      .where('userId = :userId AND deviceId = :deviceId', { userId, deviceId })
      .execute();
    return result.affected > 0;
  }

  async deleteAllUserDevicesExceptCurrent(userId, deviceId): Promise<boolean> {
    if (!isValidUUID(userId) || !isValidUUID(deviceId)) {
      return false;
    }
    const result = await this.userDevicesRepository
      .createQueryBuilder()
      .delete()
      .where('userId = :userId', { userId })
      .andWhere('deviceId <> :deviceId', { deviceId })
      .execute();

    return result.affected > 0;
  }

  async isUserDeviceExist(deviceId): Promise<boolean> {
    if (!isValidUUID(deviceId)) {
      return false;
    }
    const result = await this.userDevicesRepository.count({
      where: { deviceId },
    });
    return result > 0;
  }

  async deleteAllUserDevicesById(userId: string): Promise<boolean> {
    if (!isValidUUID(userId)) {
      return false;
    }
    const result = await this.userDevicesRepository.delete({ userId });
    return result.affected > 0;
  }
}
