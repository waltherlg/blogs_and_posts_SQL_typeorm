import { MigrationInterface, QueryRunner } from "typeorm";

export class UserPlayerStatisticSetNullOnDelete1713362880042 implements MigrationInterface {
    name = 'UserPlayerStatisticSetNullOnDelete1713362880042'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_a06d29e81a4b836dddfd684ab87"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_a06d29e81a4b836dddfd684ab87" FOREIGN KEY ("userId") REFERENCES "PlayerStatistic"("userId") ON DELETE SET NULL ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_a06d29e81a4b836dddfd684ab87"`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_a06d29e81a4b836dddfd684ab87" FOREIGN KEY ("userId") REFERENCES "PlayerStatistic"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
