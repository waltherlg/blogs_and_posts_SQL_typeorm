import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLoginFromPostLikes31699437237939 implements MigrationInterface {
    name = 'RemoveLoginFromPostLikes31699437237939'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostLikes" DROP COLUMN "login"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostLikes" ADD "login" character varying NOT NULL`);
    }

}
