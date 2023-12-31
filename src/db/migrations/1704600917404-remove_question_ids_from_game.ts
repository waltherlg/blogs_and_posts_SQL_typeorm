import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveQuestionIdsFromGame1704600917404
  implements MigrationInterface
{
  name = 'RemoveQuestionIdsFromGame1704600917404';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question1Id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question2Id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question3Id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question4Id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question5Id" DROP NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_52289f4915570c3867e08939383" FOREIGN KEY ("question1Id") REFERENCES "Questions"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_36ef7c79562385fc50027a095ec" FOREIGN KEY ("question2Id") REFERENCES "Questions"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_4907ac8fd1e83922d6151f31ee9" FOREIGN KEY ("question3Id") REFERENCES "Questions"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_201006d173eed9e7e6480eec9cb" FOREIGN KEY ("question4Id") REFERENCES "Questions"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_a9ab32e1b7b8d208e440e54f21f" FOREIGN KEY ("question5Id") REFERENCES "Questions"("questionId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_a9ab32e1b7b8d208e440e54f21f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_201006d173eed9e7e6480eec9cb"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_4907ac8fd1e83922d6151f31ee9"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_36ef7c79562385fc50027a095ec"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_52289f4915570c3867e08939383"`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question5Id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question4Id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question3Id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question2Id" SET NOT NULL`,
    );
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "question1Id" SET NOT NULL`,
    );
  }
}
