import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTelegramidTypeToBigint1723004736740
  implements MigrationInterface
{
  name = 'ChangeTelegramidTypeToBigint1723004736740';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "telegramId"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "telegramId" bigint`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "telegramId"`);
    await queryRunner.query(`ALTER TABLE "Users" ADD "telegramId" integer`);
  }
}
