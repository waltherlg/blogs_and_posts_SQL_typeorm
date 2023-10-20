import { Injectable, Query } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { UserDevices } from './users-devices.types';

@Injectable()
export class UsersDevicesRepository {
  constructor(@InjectDataSource() protected dataSource: DataSource,
              @InjectRepository(UserDevices) private readonly userDevicesRepository: Repository<UserDevices>, ) {}

async addDeviceInfo(deviceInfoDTO): Promise<boolean> {
  const result = await this.userDevicesRepository.save(deviceInfoDTO)
  return result.deviceId
}

  async getDeviceByUsersAndDeviceId(userId: string, deviceId: string) {
    if (!isValidUUID(userId) || !isValidUUID(deviceId)) {
      return null;
    }
    const query = `SELECT * FROM public."UserDevices"
    WHERE "userId" = $1 AND "deviceId" = $2
    LIMIT 1`;
    const result = await this.dataSource.query(query, [userId, deviceId]);
    return result[0];
  }
  async refreshDeviceInfo(
    deviceId,
    lastActiveDate,
    expirationDate,
  ): Promise<boolean> {
    if (!isValidUUID(deviceId)) {
      return false;
    }
    const query = `UPDATE public."UserDevices"
    SET "lastActiveDate" = $2, "expirationDate" = $3
    WHERE "deviceId" = $1 `;

    const result = await this.dataSource.query(query, [
      deviceId,
      lastActiveDate,
      expirationDate,
    ]);
    return result[1] > 0;
  }

  async deleteDeviceByUserAndDeviceId(userId, deviceId): Promise<boolean> {
    if (!isValidUUID(userId) || !isValidUUID(deviceId)) {
      return false;
    }
    const query = `
    DELETE FROM public."UserDevices"
    WHERE "userId" = $1 AND "deviceId" = $2
    `;
    const result = await this.dataSource.query(query, [userId, deviceId]);
    return result[1];
  }

  async deleteAllUserDevicesExceptCurrent(userId, deviceId): Promise<boolean> {
    if (!isValidUUID(userId) || !isValidUUID(deviceId)) {
      return false;
    }
    const query = `
    DELETE FROM public."UserDevices"
    WHERE "userId" = $1 AND "deviceId" <> $2;
    `;
    const result = await this.dataSource.query(query, [userId, deviceId]);
    return result[1] > 0;
  }

  async isUserDeviceExist(deviceId): Promise<boolean> {
    if (!isValidUUID(deviceId)) {
      return false;
    }
    const query = `
    SELECT COUNT(*) AS count
    FROM public."UserDevices"
    WHERE "deviceId" = $1
  `;
    const result = await this.dataSource.query(query, [deviceId]);
    const count = result[0].count;
    return count > 0;
  }

  async deleteAllUserDevicesById(userId: string): Promise<boolean> {
    if (!isValidUUID(userId)) {
      return false;
    }
    const query = `   
    DELETE FROM public."UserDevices"
    WHERE "userId" = $1
    `;
    const result = await this.dataSource.query(query, [userId]);
    return result.rowCount > 0;
  }
}
