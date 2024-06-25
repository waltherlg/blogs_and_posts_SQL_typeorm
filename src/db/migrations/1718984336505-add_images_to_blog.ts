import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddImagesToBlog1718984336505 implements MigrationInterface {
  name = 'AddImagesToBlog1718984336505';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "BlogWallpaperImage" ("imageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "url" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "fileSize" integer NOT NULL, CONSTRAINT "REL_12583ebd434101c1574115e881" UNIQUE ("blogId"), CONSTRAINT "PK_af9a4a01f05a812b5a720e5acba" PRIMARY KEY ("imageId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "BlogMainImage" ("imageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "url" character varying NOT NULL, "width" integer NOT NULL, "height" integer NOT NULL, "fileSize" integer NOT NULL, CONSTRAINT "REL_8e79ce5fde5611c844e29ca7d3" UNIQUE ("blogId"), CONSTRAINT "PK_71eb7702ee7a22387683f1e7061" PRIMARY KEY ("imageId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogWallpaperImage" ADD CONSTRAINT "FK_12583ebd434101c1574115e881c" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogMainImage" ADD CONSTRAINT "FK_8e79ce5fde5611c844e29ca7d3b" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "BlogMainImage" DROP CONSTRAINT "FK_8e79ce5fde5611c844e29ca7d3b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogWallpaperImage" DROP CONSTRAINT "FK_12583ebd434101c1574115e881c"`,
    );
    await queryRunner.query(`DROP TABLE "BlogMainImage"`);
    await queryRunner.query(`DROP TABLE "BlogWallpaperImage"`);
  }
}
