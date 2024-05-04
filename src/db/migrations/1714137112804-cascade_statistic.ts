import { MigrationInterface, QueryRunner } from 'typeorm';

export class CascadeStatistic1714137112804 implements MigrationInterface {
  name = 'CascadeStatistic1714137112804';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PlayerStatistic" DROP CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PlayerStatistic" ADD CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PlayerStatistic" DROP CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PlayerStatistic" ADD CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
