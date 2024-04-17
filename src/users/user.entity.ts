import { BlogBannedUsers } from '../blogs/blog.entity';
import { Comments } from '../comments/comment.entity';
import { UserDevices } from '../usersDevices/user.device.entity';
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
import { UserDBType } from './users.types';
import { PlayerStatistic } from '../quizGame/quiz.game.statistic.type';

//TODO: Спросить, можно ли наследовать энтити от класса
@Entity({ name: 'Users' })
export class Users extends UserDBType {
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
  @OneToMany(() => BlogBannedUsers, (b) => b.Users, { cascade: ['remove'] }) // рабочее
  @JoinColumn({ name: 'userId' })
  BlogBannedUsers: BlogBannedUsers[];
  //TODO: спросить, как сделать миграцию, которая добавляет зависимость, если в БД уже есть записи
  // в моем случае миграция не удавалась, потому что айдишки УЖЕ были у ползователей,
  // и они пытались ссылаться на таблицу статистики, несмотря на наличие nullable: true
  @OneToOne(() => PlayerStatistic, (p) => p.Users, { cascade: ['remove'], nullable: true })
  @JoinColumn({ name: 'userId' })
  PlayerStatistic: PlayerStatistic | null;
}
