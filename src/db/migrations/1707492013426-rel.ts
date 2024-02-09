import { MigrationInterface, QueryRunner } from "typeorm";

export class Rel1707492013426 implements MigrationInterface {
    name = 'Rel1707492013426'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP CONSTRAINT "FK_7ad4361119e8133e6ed255ee67d"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "quizGamesQuizGameId"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "quizGamesQuizGameId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD CONSTRAINT "FK_7ad4361119e8133e6ed255ee67d" FOREIGN KEY ("quizGamesQuizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
