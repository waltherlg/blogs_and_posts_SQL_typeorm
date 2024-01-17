import { MigrationInterface, QueryRunner } from "typeorm";

export class AddBodyToAnswerEntity1705490264972 implements MigrationInterface {
    name = 'AddBodyToAnswerEntity1705490264972'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizAnswers" ADD "body" character varying NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizAnswers" DROP COLUMN "body"`);
    }

}
