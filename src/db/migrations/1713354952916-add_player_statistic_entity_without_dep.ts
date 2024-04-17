import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayerStatisticEntityWithoutDep1713354952916 implements MigrationInterface {
    name = 'AddPlayerStatisticEntityWithoutDep1713354952916'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PlayerStatistic" ("userId" uuid NOT NULL, "sumScore" integer NOT NULL, "avgScores" integer NOT NULL, "gamesCount" integer NOT NULL, "winsCount" integer NOT NULL, "lossesCount" integer NOT NULL, "drawsCount" integer NOT NULL, CONSTRAINT "PK_fd8b6f6beca5484b1f634334bd8" PRIMARY KEY ("userId"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "PlayerStatistic"`);
    }

}
