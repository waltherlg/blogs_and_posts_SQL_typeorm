import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetNullOnDeleteUsersIngame1704601482903
  implements MigrationInterface
{
  name = 'SetNullOnDeleteUsersIngame1704601482903';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_5340f16b12f43808d79f73994d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_3b43ab232a8954c7d45e93a071d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_3b43ab232a8954c7d45e93a071d" FOREIGN KEY ("player1Id") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_5340f16b12f43808d79f73994d2" FOREIGN KEY ("player2Id") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_5340f16b12f43808d79f73994d2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_3b43ab232a8954c7d45e93a071d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_3b43ab232a8954c7d45e93a071d" FOREIGN KEY ("player1Id") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_5340f16b12f43808d79f73994d2" FOREIGN KEY ("player2Id") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
