import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelCommentLikes31699883902307 implements MigrationInterface {
    name = 'FixRelCommentLikes31699883902307'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP COLUMN "isUserBanned"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD "isUserBanned" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD "login" character varying`);
    }

}
