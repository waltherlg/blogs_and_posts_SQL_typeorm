import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveTelegrammdFromLogubscriber1721967009102 implements MigrationInterface {
    name = 'RemoveTelegrammdFromLogubscriber1721967009102'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogSubscribers" DROP COLUMN "telegramId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogSubscribers" ADD "telegramId" character varying`);
    }

}
