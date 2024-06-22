import { MigrationInterface, QueryRunner } from "typeorm";

export class NullableTrueInBlogImage1719065787396 implements MigrationInterface {
    name = 'NullableTrueInBlogImage1719065787396'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "width" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "fileSize" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "url" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "width" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "height" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "fileSize" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "fileSize" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "width" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogMainImage" ALTER COLUMN "url" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "fileSize" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "height" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "width" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "BlogWallpaperImage" ALTER COLUMN "url" SET NOT NULL`);
    }

}
