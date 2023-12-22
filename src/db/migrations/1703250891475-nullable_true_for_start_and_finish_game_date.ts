import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableTrueForStartAndFinishGameDate1703250891475 implements MigrationInterface {
    name = 'NullableTrueForStartAndFinishGameDate1703250891475'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" ALTER COLUMN "startGameDate" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ALTER COLUMN "finishGameDate" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" ALTER COLUMN "finishGameDate" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ALTER COLUMN "startGameDate" SET NOT NULL`);
    }

}
