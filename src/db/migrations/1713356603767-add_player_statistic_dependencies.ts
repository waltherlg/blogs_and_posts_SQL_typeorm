import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPlayerStatisticDependencies1713356603767 implements MigrationInterface {
    name = 'AddPlayerStatisticDependencies1713356603767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" ADD CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Users" ADD CONSTRAINT "FK_a06d29e81a4b836dddfd684ab87" FOREIGN KEY ("userId") REFERENCES "PlayerStatistic"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Users" DROP CONSTRAINT "FK_a06d29e81a4b836dddfd684ab87"`);
        await queryRunner.query(`ALTER TABLE "PlayerStatistic" DROP CONSTRAINT "FK_fd8b6f6beca5484b1f634334bd8"`);
    }

}
