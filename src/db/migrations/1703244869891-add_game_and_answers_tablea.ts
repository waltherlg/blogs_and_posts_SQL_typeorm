import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGameAndAnswersTablea1703244869891
  implements MigrationInterface
{
  name = 'AddGameAndAnswersTablea1703244869891';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "QuizGames" ("quizGameId" uuid NOT NULL, "status" character varying NOT NULL, "pairCreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "startGameDate" TIMESTAMP WITH TIME ZONE NOT NULL, "finishGameDate" TIMESTAMP WITH TIME ZONE NOT NULL, "gameIndicatorPlayer1" uuid NOT NULL, "gameIndicatorPlayer2" uuid NOT NULL, "question1Id" uuid NOT NULL, "question2Id" uuid NOT NULL, "question3Id" uuid NOT NULL, "question4Id" uuid NOT NULL, "question5Id" uuid NOT NULL, CONSTRAINT "UQ_49ab1ef635f18b1ee247b37bcbd" UNIQUE ("gameIndicatorPlayer1"), CONSTRAINT "UQ_e3a1301e4a5179d85475f88dc60" UNIQUE ("gameIndicatorPlayer2"), CONSTRAINT "PK_606d9730a61290fead10be8bf1a" PRIMARY KEY ("quizGameId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "QuizAnswers" ("answerId" uuid NOT NULL, "gamePlayerIndicator" uuid NOT NULL, "questionId" uuid NOT NULL, "ansertStatus" character varying NOT NULL, "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1ae073fa5945c4fbe1042d2f383" PRIMARY KEY ("answerId"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "QuizAnswers"`);
    await queryRunner.query(`DROP TABLE "QuizGames"`);
  }
}
