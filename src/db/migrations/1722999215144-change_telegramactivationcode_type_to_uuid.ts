import { MigrationInterface, QueryRunner } from 'typeorm';

export class ChangeTelegramactivationcodeTypeToUuid1722999215144
  implements MigrationInterface
{
  name = 'ChangeTelegramactivationcodeTypeToUuid1722999215144';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "telegramActivationCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "telegramActivationCode" uuid`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" DROP COLUMN "telegramActivationCode"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "telegramActivationCode" character varying`,
    );
  }
}
