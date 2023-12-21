import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnswersTableAndGameWithAnswersIds1703047355565 implements MigrationInterface {
    name = 'AddAnswersTableAndGameWithAnswersIds1703047355565'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "QuizGames" ("quizGameId" uuid NOT NULL, "gameIndicatorPlayer1" uuid NOT NULL, CONSTRAINT "UQ_49ab1ef635f18b1ee247b37bcbd" UNIQUE ("gameIndicatorPlayer1"), CONSTRAINT "PK_606d9730a61290fead10be8bf1a" PRIMARY KEY ("quizGameId"))`);
        await queryRunner.query(`CREATE TABLE "QuizAnswers" ("answerId" uuid NOT NULL, "gamePlayerIndicator" uuid NOT NULL, "questionId" uuid NOT NULL, "ansertStatus" character varying NOT NULL, "addedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_1ae073fa5945c4fbe1042d2f383" PRIMARY KEY ("answerId"))`);
        await queryRunner.query(`CREATE TABLE "quiz_games_player1_answers_quiz_answers" ("quizGamesQuizGameId" uuid NOT NULL, "quizAnswersAnswerId" uuid NOT NULL, CONSTRAINT "PK_3f7d350581a77d640c6143c9417" PRIMARY KEY ("quizGamesQuizGameId", "quizAnswersAnswerId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_71e0adeccba081cea72478ad57" ON "quiz_games_player1_answers_quiz_answers" ("quizGamesQuizGameId") `);
        await queryRunner.query(`CREATE INDEX "IDX_282e610dd93ecf6afb73028310" ON "quiz_games_player1_answers_quiz_answers" ("quizAnswersAnswerId") `);
        await queryRunner.query(`CREATE TABLE "quiz_answers_quiz_games_quiz_games" ("quizAnswersAnswerId" uuid NOT NULL, "quizGamesQuizGameId" uuid NOT NULL, CONSTRAINT "PK_847a79e9de37f955d6e81c6f3b1" PRIMARY KEY ("quizAnswersAnswerId", "quizGamesQuizGameId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c68174f14d69deb6847c7f85c7" ON "quiz_answers_quiz_games_quiz_games" ("quizAnswersAnswerId") `);
        await queryRunner.query(`CREATE INDEX "IDX_0fc4ca86f843c82bcceddefaec" ON "quiz_answers_quiz_games_quiz_games" ("quizGamesQuizGameId") `);
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" ADD CONSTRAINT "FK_71e0adeccba081cea72478ad579" FOREIGN KEY ("quizGamesQuizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" ADD CONSTRAINT "FK_282e610dd93ecf6afb730283106" FOREIGN KEY ("quizAnswersAnswerId") REFERENCES "QuizAnswers"("answerId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_answers_quiz_games_quiz_games" ADD CONSTRAINT "FK_c68174f14d69deb6847c7f85c74" FOREIGN KEY ("quizAnswersAnswerId") REFERENCES "QuizAnswers"("answerId") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "quiz_answers_quiz_games_quiz_games" ADD CONSTRAINT "FK_0fc4ca86f843c82bcceddefaecb" FOREIGN KEY ("quizGamesQuizGameId") REFERENCES "QuizGames"("quizGameId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_answers_quiz_games_quiz_games" DROP CONSTRAINT "FK_0fc4ca86f843c82bcceddefaecb"`);
        await queryRunner.query(`ALTER TABLE "quiz_answers_quiz_games_quiz_games" DROP CONSTRAINT "FK_c68174f14d69deb6847c7f85c74"`);
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" DROP CONSTRAINT "FK_282e610dd93ecf6afb730283106"`);
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" DROP CONSTRAINT "FK_71e0adeccba081cea72478ad579"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0fc4ca86f843c82bcceddefaec"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c68174f14d69deb6847c7f85c7"`);
        await queryRunner.query(`DROP TABLE "quiz_answers_quiz_games_quiz_games"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_282e610dd93ecf6afb73028310"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_71e0adeccba081cea72478ad57"`);
        await queryRunner.query(`DROP TABLE "quiz_games_player1_answers_quiz_answers"`);
        await queryRunner.query(`DROP TABLE "QuizAnswers"`);
        await queryRunner.query(`DROP TABLE "QuizGames"`);
    }

}
