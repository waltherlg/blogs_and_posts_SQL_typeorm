import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLoginIsUserBannedCollumnsFromPostLikes1699363225542 implements MigrationInterface {
    name = 'RemoveLoginIsUserBannedCollumnsFromPostLikes1699363225542'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" DROP CONSTRAINT "FK_dd3b167580f78966c582e5f54b3"`);
        await queryRunner.query(`ALTER TABLE "PostLikes" DROP COLUMN "login"`);
        await queryRunner.query(`ALTER TABLE "PostLikes" DROP COLUMN "isUserBanned"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostLikes" ADD "isUserBanned" boolean NOT NULL`);
        await queryRunner.query(`ALTER TABLE "PostLikes" ADD "login" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" ADD CONSTRAINT "FK_dd3b167580f78966c582e5f54b3" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
