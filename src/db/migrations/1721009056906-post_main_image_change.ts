import { MigrationInterface, QueryRunner } from 'typeorm';

export class PostMainImageChange1721009056906 implements MigrationInterface {
  name = 'PostMainImageChange1721009056906';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "urlMiddle" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "widthMiddle" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "heightMiddle" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "fileSizeMiddle" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "urlSmall" character varying`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "widthSmall" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "heightSmall" integer`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" ADD "fileSizeSmall" integer`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "fileSizeSmall"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "heightSmall"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "widthSmall"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "urlSmall"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "fileSizeMiddle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "heightMiddle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "widthMiddle"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostMainImage" DROP COLUMN "urlMiddle"`,
    );
  }
}
