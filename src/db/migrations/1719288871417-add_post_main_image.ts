import { MigrationInterface, QueryRunner } from "typeorm";

export class AddPostMainImage1719288871417 implements MigrationInterface {
    name = 'AddPostMainImage1719288871417'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "PostMainImage" ("imageId" uuid NOT NULL DEFAULT uuid_generate_v4(), "postId" uuid NOT NULL, "url" character varying, "width" integer, "height" integer, "fileSize" integer, CONSTRAINT "REL_1cdebf96432ad67a18ec94699b" UNIQUE ("postId"), CONSTRAINT "PK_5f4a748608067365b2d633ddc10" PRIMARY KEY ("imageId"))`);
        await queryRunner.query(`ALTER TABLE "PostMainImage" ADD CONSTRAINT "FK_1cdebf96432ad67a18ec94699be" FOREIGN KEY ("postId") REFERENCES "Posts"("postId") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "PostMainImage" DROP CONSTRAINT "FK_1cdebf96432ad67a18ec94699be"`);
        await queryRunner.query(`DROP TABLE "PostMainImage"`);
    }

}
