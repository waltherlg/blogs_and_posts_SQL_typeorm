import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsubscribeToBlogsubs1723368538921 implements MigrationInterface {
    name = 'AddIsubscribeToBlogsubs1723368538921'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogSubscribers" ADD "isSubscribe" boolean NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogSubscribers" DROP COLUMN "isSubscribe"`);
    }

}
