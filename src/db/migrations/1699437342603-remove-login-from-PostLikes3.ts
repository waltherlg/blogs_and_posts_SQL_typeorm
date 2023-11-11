import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveLoginFromPostLikes31699437342603
  implements MigrationInterface
{
  name = 'RemoveLoginFromPostLikes31699437342603';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostLikes" DROP COLUMN "isUserBanned"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostLikes" ADD "isUserBanned" boolean NOT NULL`,
    );
  }
}
