import { MigrationInterface, QueryRunner } from 'typeorm';

export class Player2IdNullableTrue1703251345629 implements MigrationInterface {
  name = 'Player2IdNullableTrue1703251345629';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "player2Id" DROP NOT NULL`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "QuizGames" ALTER COLUMN "player2Id" SET NOT NULL`,
    );
  }
}
