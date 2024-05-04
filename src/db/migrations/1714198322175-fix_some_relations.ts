import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixSomeRelations1714198322175 implements MigrationInterface {
  name = 'FixSomeRelations1714198322175';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" DROP CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserDevices" DROP CONSTRAINT "FK_4763e47aa692606f486c38cd381"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE SET NULL ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserDevices" ADD CONSTRAINT "FK_4763e47aa692606f486c38cd381" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserDevices" DROP CONSTRAINT "FK_4763e47aa692606f486c38cd381"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" DROP CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserDevices" ADD CONSTRAINT "FK_4763e47aa692606f486c38cd381" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }
}
