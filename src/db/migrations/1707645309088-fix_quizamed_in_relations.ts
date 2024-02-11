import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixQuizamedInRelations1707645309088 implements MigrationInterface {
  name = 'FixQuizamedInRelations1707645309088';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizAnswers" DROP CONSTRAINT "FK_7ad4361119e8133e6ed255ee67d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizAnswers" RENAME COLUMN "quizGamesQuizGameId" TO "quizGameId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizAnswers" ADD CONSTRAINT "FK_ccf9074e4bb845c8333195e06aa" FOREIGN KEY ("quizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizAnswers" DROP CONSTRAINT "FK_ccf9074e4bb845c8333195e06aa"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizAnswers" RENAME COLUMN "quizGameId" TO "quizGamesQuizGameId"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizAnswers" ADD CONSTRAINT "FK_7ad4361119e8133e6ed255ee67d" FOREIGN KEY ("quizGamesQuizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
