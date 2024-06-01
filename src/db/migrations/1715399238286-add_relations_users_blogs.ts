import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddRelationsUsersBlogs1715399238286 implements MigrationInterface {
  name = 'AddRelationsUsersBlogs1715399238286';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Blogs" ADD CONSTRAINT "FK_b0bffda8207abafe39d3ea54c83" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Blogs" DROP CONSTRAINT "FK_b0bffda8207abafe39d3ea54c83"`,
    );
  }
}
