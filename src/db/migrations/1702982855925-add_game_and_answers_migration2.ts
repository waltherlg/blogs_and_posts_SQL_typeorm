import { MigrationInterface, QueryRunner } from "typeorm";

export class AddGameAndAnswersMigration21702982855925 implements MigrationInterface {
    name = 'AddGameAndAnswersMigration21702982855925'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "QuizAnswers" ("answerId" uuid NOT NULL, "gameIndicator" uuid NOT NULL, "questionId" uuid NOT NULL, "ansertStatus" character varying NOT NULL, "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1ae073fa5945c4fbe1042d2f383" PRIMARY KEY ("answerId"))`);
        await queryRunner.query(`CREATE TABLE "QuizGames" ("quizGameId" uuid NOT NULL, "status" character varying NOT NULL, "pairCreatedDate" TIMESTAMP WITH TIME ZONE NOT NULL, "startGameDate" TIMESTAMP WITH TIME ZONE NOT NULL, "finishGameDate" TIMESTAMP WITH TIME ZONE NOT NULL, "player1Id" uuid NOT NULL, "gameIndicatorPlayer1" uuid NOT NULL, "player1Score" integer NOT NULL, "player2Id" uuid NOT NULL, "gameIndicatorPlayer2" uuid NOT NULL, "player2Score" integer NOT NULL, CONSTRAINT "REL_3b43ab232a8954c7d45e93a071" UNIQUE ("player1Id"), CONSTRAINT "REL_5340f16b12f43808d79f73994d" UNIQUE ("player2Id"), CONSTRAINT "PK_606d9730a61290fead10be8bf1a" PRIMARY KEY ("quizGameId"))`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_3b43ab232a8954c7d45e93a071d" FOREIGN KEY ("player1Id") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_5340f16b12f43808d79f73994d2" FOREIGN KEY ("player2Id") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_5340f16b12f43808d79f73994d2"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_3b43ab232a8954c7d45e93a071d"`);
        await queryRunner.query(`DROP TABLE "QuizGames"`);
        await queryRunner.query(`DROP TABLE "QuizAnswers"`);
    }

}
