import { MigrationInterface, QueryRunner } from "typeorm";

export class TryAddStatistic1713505312485 implements MigrationInterface {
    name = 'TryAddStatistic1713505312485'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PlayerStatistic" ("playerStatisticId" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "sumScore" integer NOT NULL, "avgScores" integer NOT NULL, "gamesCount" integer NOT NULL, "winsCount" integer NOT NULL, "lossesCount" integer NOT NULL, "drawsCount" integer NOT NULL, CONSTRAINT "REL_fd8b6f6beca5484b1f634334bd" UNIQUE ("userId"), CONSTRAINT "PK_5e4cb6e9f5c91eb821faa21502a" PRIMARY KEY ("playerStatisticId"))`);
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" ADD CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" DROP CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8"`);
        await queryRunner.query(`DROP TABLE "PlayerStatistic"`);
    }

}
