import { MigrationInterface, QueryRunner } from "typeorm";

export class AddQuestionTable1701270108285 implements MigrationInterface {
    name = 'AddQuestionTable1701270108285'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "Questions" ("questionId" uuid NOT NULL, "body" character varying NOT NULL, "correctAnswers" jsonb NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_13221c506f69d8e080bcbfff947" PRIMARY KEY ("questionId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "Questions"`);
    }

}
