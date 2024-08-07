import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddColumnTelegramactivationcodeToUser1722940763596
  implements MigrationInterface
{
  name = 'AddColumnTelegramactivationcodeToUser1722940763596';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" RENAME COLUMN "telegrammId" TO "telegramActivationCode"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" RENAME COLUMN "telegramActivationCode" TO "telegrammId"`,
    );
  }
}
