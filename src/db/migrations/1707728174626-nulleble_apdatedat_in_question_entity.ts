import { MigrationInterface, QueryRunner } from "typeorm";

export class NullebleApdatedatInQuestionEntity1707728174626 implements MigrationInterface {
    name = 'NullebleApdatedatInQuestionEntity1707728174626'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Questions" ALTER COLUMN "updatedAt" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Questions" ALTER COLUMN "updatedAt" SET NOT NULL`);
    }

}
