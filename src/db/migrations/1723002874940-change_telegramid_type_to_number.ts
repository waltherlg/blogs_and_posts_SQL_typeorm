import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeTelegramidTypeToNumber1723002874940 implements MigrationInterface {
    name = 'ChangeTelegramidTypeToNumber1723002874940'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "telegramId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "telegramId" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP COLUMN "telegramId"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD "telegramId" character varying`);
    }

}
