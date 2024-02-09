import { MigrationInterface, QueryRunner } from "typeorm";

export class MergedPlayer1707486731342 implements MigrationInterface {
    name = 'MergedPlayer1707486731342'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "UQ_49ab1ef635f18b1ee247b37bcbd"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "gameIndicatorPlayer1"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "UQ_e3a1301e4a5179d85475f88dc60"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "gameIndicatorPlayer2"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "gamePlayerIndicator"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "ansertStatus"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "playerNumber" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "answerStatus" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "quizGamesQuizGameId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD CONSTRAINT "FK_7ad4361119e8133e6ed255ee67d" FOREIGN KEY ("quizGamesQuizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP CONSTRAINT "FK_7ad4361119e8133e6ed255ee67d"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "quizGamesQuizGameId"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "answerStatus"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "playerNumber"`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "ansertStatus" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "gamePlayerIndicator" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "gameIndicatorPlayer2" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "UQ_e3a1301e4a5179d85475f88dc60" UNIQUE ("gameIndicatorPlayer2")`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "gameIndicatorPlayer1" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "UQ_49ab1ef635f18b1ee247b37bcbd" UNIQUE ("gameIndicatorPlayer1")`);
    }

}
