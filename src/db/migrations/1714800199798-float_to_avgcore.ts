import { MigrationInterface, QueryRunner } from "typeorm";

export class FloatToAvgcore1714800199798 implements MigrationInterface {
    name = 'FloatToAvgcore1714800199798'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" DROP COLUMN "avgScores"`);
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" ADD "avgScores" double precision NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" DROP COLUMN "avgScores"`);
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" ADD "avgScores" integer NOT NULL`);
    }

}
