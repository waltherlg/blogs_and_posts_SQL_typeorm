import { Users } from "src/users/users.types";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity({ name: 'UserDevices' })
export class UserDevices {
    @PrimaryGeneratedColumn('uuid')
    deviceId: string;
    @ManyToOne(() => Users )
    @JoinColumn({ name: 'userId' })
    Users: Users
    // @Column('uuid')
    // userId: string;
    @Column()
    ip: string;
    @Column()
    title: string;
    @Column({type: 'timestamptz'})
    lastActiveDate: Date;
    @Column({type: 'timestamptz'})
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

