import { MigrationInterface, QueryRunner } from "typeorm";

export class UpdatePostTable1699363103068 implements MigrationInterface {
    name = 'UpdatePostTable1699363103068'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" DROP CONSTRAINT "FK_dd3b167580f78966c582e5f54b3"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogBannedUsers" ADD CONSTRAINT "FK_dd3b167580f78966c582e5f54b3" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
