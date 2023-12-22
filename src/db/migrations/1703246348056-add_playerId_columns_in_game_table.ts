import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayerIdColumnsInGameTable1703246348056 implements MigrationInterface {
    name = 'AddPlayerIdColumnsInGameTable1703246348056'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "player1Id" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "player2Id" uuid NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "player2Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "player1Id"`);
    }

}
