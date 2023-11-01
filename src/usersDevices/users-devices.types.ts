import { Users } from '../users/users.types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'UserDevices' })
export class UserDevices {
  @PrimaryColumn('uuid')
  deviceId: string;
  @ManyToOne(() => Users, (u) => u.UserDevices)
  Users: Users;
  @Column('uuid')
  userId: string;
  @Column()
  ip: string;
  @Column()
  title: string;
  @Column({ type: 'timestamptz' })
  lastActiveDate: Date;
  @Column({ type: 'timestamptz' })
  expirationDate: Date;
}

export class UserDeviceDBType {
  constructor(
    public deviceId: string,
    public userId: string,
    public ip: string,
    public title: string,
    public lastActiveDate: string,
    public expirationDate: string,
  ) {}
}

export type UserDeviceOutputType = {
  ip: string;
  title: string | unknown | null;
  lastActiveDate: string;
  deviceId: string;
};
