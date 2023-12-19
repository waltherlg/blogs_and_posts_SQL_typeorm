import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionsToGameEntity1702983022748 implements MigrationInterface {
    name = 'AddQuestionsToGameEntity1702983022748'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question1Id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question2Id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question3Id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question4Id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question5Id" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question5Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question4Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question3Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question2Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question1Id"`);
    }

}
