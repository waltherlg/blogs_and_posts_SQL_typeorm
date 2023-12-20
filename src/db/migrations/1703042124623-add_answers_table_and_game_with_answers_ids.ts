import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnswersTableAndGameWithAnswersIds1703042124623 implements MigrationInterface {
    name = 'AddAnswersTableAndGameWithAnswersIds1703042124623'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "QuizAnswers" ("answerId" uuid NOT NULL, "gamePlayerIndicator" uuid NOT NULL, "questionId" uuid NOT NULL, "ansertStatus" character varying NOT NULL, "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1ae073fa5945c4fbe1042d2f383" PRIMARY KEY ("answerId"))`);
        await queryRunner.query(`CREATE TABLE "QuizGames" ("quizGameId" uuid NOT NULL, "gameIndicatorPlayer1" uuid NOT NULL, CONSTRAINT "UQ_49ab1ef635f18b1ee247b37bcbd" UNIQUE ("gameIndicatorPlayer1"), CONSTRAINT "PK_606d9730a61290fead10be8bf1a" PRIMARY KEY ("quizGameId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "QuizGames"`);
        await queryRunner.query(`DROP TABLE "QuizAnswers"`);
    }

}
