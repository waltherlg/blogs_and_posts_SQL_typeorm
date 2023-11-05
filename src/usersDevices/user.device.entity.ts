import { Users } from '../users/user.entity';
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
  @JoinColumn({ name: 'userId' })
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