import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTelegrammdInLogubscriber1721965381504
  implements MigrationInterface
{
  name = 'AddTelegrammdInLogubscriber1721965381504';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "BlogSubscribers" ADD "telegramId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "BlogSubscribers" DROP COLUMN "telegramId"`,
    );
  }
}
