import { BlogBannedUsers } from 'src/blogs/blogs.types';
import { Comments } from '../comments/comments.types';
import { UserDevices } from '../usersDevices/users-devices.types';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'Users' })
export class Users {
  @PrimaryColumn('uuid')
  userId: string;
  @Column()
  login: string;
  @Column()
  passwordHash: string;
  @Column()
  email: string;
  @Column()
  createdAt: string;
  @Column()
  isUserBanned: boolean;
  @Column({ nullable: true })
  banDate: string | null;
  @Column({ nullable: true })
  banReason: string | null;
  @Column({ nullable: true })
  confirmationCode: string | null;
  @Column({ type: 'timestamptz', nullable: true })
  expirationDateOfConfirmationCode: Date | null;
  @Column()
  isConfirmed: boolean;
  @Column({ nullable: true })
  passwordRecoveryCode: string | null;
  @Column({ type: 'timestamptz', nullable: true })
  expirationDateOfRecoveryCode: Date | null;
  @OneToMany(() => UserDevices, (d) => d.Users, { cascade: ['remove'] })
  @JoinColumn({ name: 'userId' })
  UserDevices: UserDevices[];
  @OneToMany(() => Comments, (c) => c.Users, { cascade: ['remove'] })
  @JoinColumn({ name: 'userId' })
  Comments: Comments[];
  @OneToMany(() => BlogBannedUsers, (b) => b.Users, { cascade: ['remove'] })
  @JoinColumn({ name: 'userId' })
  BlogBannedUsers: BlogBannedUsers[];
}