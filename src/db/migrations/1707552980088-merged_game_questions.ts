import { MigrationInterface, QueryRunner } from "typeorm";

export class MergedGameQuestions1707552980088 implements MigrationInterface {
    name = 'MergedGameQuestions1707552980088'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_a9ab32e1b7b8d208e440e54f21f"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_201006d173eed9e7e6480eec9cb"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_4907ac8fd1e83922d6151f31ee9"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_36ef7c79562385fc50027a095ec"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_52289f4915570c3867e08939383"`);
        await queryRunner.query(`CREATE TABLE "quiz_games_questions_questions" ("quizGamesQuizGameId" uuid NOT NULL, "questionsQuestionId" uuid NOT NULL, CONSTRAINT "PK_711fb8e1b508c7b8efd0221286b" PRIMARY KEY ("quizGamesQuizGameId", "questionsQuestionId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_78a54acaf11e5437d894736f8a" ON "quiz_games_questions_questions" ("quizGamesQuizGameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_30f4674e379b56a125e2e00905" ON "quiz_games_questions_questions" ("questionsQuestionId") `);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question1Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question2Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question3Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question4Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question5Id"`);
        await queryRunner.query(`ALTER TABLE "quiz_games_questions_questions" ADD CONSTRAINT "FK_78a54acaf11e5437d894736f8a0" FOREIGN KEY ("quizGamesQuizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_games_questions_questions" ADD CONSTRAINT "FK_30f4674e379b56a125e2e00905d" FOREIGN KEY ("questionsQuestionId") REFERENCES "Questions"("questionId") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_games_questions_questions" DROP CONSTRAINT "FK_30f4674e379b56a125e2e00905d"`);
        await queryRunner.query(`ALTER TABLE "quiz_games_questions_questions" DROP CONSTRAINT "FK_78a54acaf11e5437d894736f8a0"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question5Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question4Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question3Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question2Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question1Id" uuid`);
        await queryRunner.query(`DROP INDEX "public"."IDX_30f4674e379b56a125e2e00905"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_78a54acaf11e5437d894736f8a"`);
        await queryRunner.query(`DROP TABLE "quiz_games_questions_questions"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_52289f4915570c3867e08939383" FOREIGN KEY ("question1Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_36ef7c79562385fc50027a095ec" FOREIGN KEY ("question2Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_4907ac8fd1e83922d6151f31ee9" FOREIGN KEY ("question3Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_201006d173eed9e7e6480eec9cb" FOREIGN KEY ("question4Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_a9ab32e1b7b8d208e440e54f21f" FOREIGN KEY ("question5Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
