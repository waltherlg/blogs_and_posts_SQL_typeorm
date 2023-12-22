import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayersScoresToGameTable1703245915438 implements MigrationInterface {
    name = 'AddPlayersScoresToGameTable1703245915438'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "player1Score" integer NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "player2Score" integer NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "player2Score"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "player1Score"`);
    }

}
