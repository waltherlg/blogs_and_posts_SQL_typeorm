import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { validate as isValidUUID } from 'uuid';
import { UserDevices } from './user.device.entity';

@Injectable()
export class UserDevicesQueryRepository {
  constructor(
    @InjectDataSource() protected dataSource: DataSource,
    @InjectRepository(UserDevices)
    private readonly userDevicesRepository: Repository<UserDevices>,
  ) {}

  async getActiveUserDevices(userId: string) {
    if (!isValidUUID(userId)) {
      return null;
    }
    const result = await this.userDevicesRepository
      .createQueryBuilder('device')
      .select([
        'device.ip',
        'device.title',
        'device.lastActiveDate',
        'device.deviceId',
      ])
      .where('device.userId = :userId', { userId: userId })
      .getMany();
    return result;
  }
}
