import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTelegramidToUser1721968773165 implements MigrationInterface {
    name = 'AddTelegramidToUser1721968773165'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" ADD "telegramId" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "telegramId"`);
    }

}
