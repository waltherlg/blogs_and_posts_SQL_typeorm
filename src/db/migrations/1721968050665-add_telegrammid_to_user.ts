import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTelegrammidToUser1721968050665 implements MigrationInterface {
  name = 'AddTelegrammidToUser1721968050665';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Users" ADD "telegrammId" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "telegrammId"`);
  }
}
