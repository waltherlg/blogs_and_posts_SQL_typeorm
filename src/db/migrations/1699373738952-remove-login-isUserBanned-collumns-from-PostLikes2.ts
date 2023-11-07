import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveLoginIsUserBannedCollumnsFromPostLikes21699373738952 implements MigrationInterface {
    name = 'RemoveLoginIsUserBannedCollumnsFromPostLikes21699373738952'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" DROP CONSTRAINT "FK_dd3b167580f78966c582e5f54b3"`);
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" DROP CONSTRAINT "FK_19cb7e96476f86fd5d414aff8a2"`);
        await queryRunner.query(`CREATE TABLE "RelationsBlogBannedUsersTable" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userUserId" uuid, "blogBannedUsersBanId" uuid, CONSTRAINT "PK_7dec936f6c41827b4550e2b608f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "RelationsBlogBannedUsersTable" ADD CONSTRAINT "FK_6429eacb3e3091fbbe74bc665a8" FOREIGN KEY ("userUserId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "RelationsBlogBannedUsersTable" ADD CONSTRAINT "FK_f52d3344ee29df5b91a61c161f7" FOREIGN KEY ("blogBannedUsersBanId") REFERENCES "BlogBannedUsers"("banId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "RelationsBlogBannedUsersTable" DROP CONSTRAINT "FK_f52d3344ee29df5b91a61c161f7"`);
        await queryRunner.query(`ALTER TABLE "RelationsBlogBannedUsersTable" DROP CONSTRAINT "FK_6429eacb3e3091fbbe74bc665a8"`);
        await queryRunner.query(`DROP TABLE "RelationsBlogBannedUsersTable"`);
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" ADD CONSTRAINT "FK_19cb7e96476f86fd5d414aff8a2" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" ADD CONSTRAINT "FK_dd3b167580f78966c582e5f54b3" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
