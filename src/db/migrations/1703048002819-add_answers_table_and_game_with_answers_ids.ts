import { MigrationInterface, QueryRunner } from "typeorm";

export class AddAnswersTableAndGameWithAnswersIds1703048002819 implements MigrationInterface {
    name = 'AddAnswersTableAndGameWithAnswersIds1703048002819'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" DROP CONSTRAINT "FK_282e610dd93ecf6afb730283106"`);
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" ADD CONSTRAINT "FK_282e610dd93ecf6afb730283106" FOREIGN KEY ("quizAnswersAnswerId") REFERENCES "QuizAnswers"("answerId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" DROP CONSTRAINT "FK_282e610dd93ecf6afb730283106"`);
        await queryRunner.query(`ALTER TABLE "quiz_games_player1_answers_quiz_answers" ADD CONSTRAINT "FK_282e610dd93ecf6afb730283106" FOREIGN KEY ("quizAnswersAnswerId") REFERENCES "QuizAnswers"("answerId") ON DELETE CASCADE ON UPDATE CASCADE`);
    }

}
