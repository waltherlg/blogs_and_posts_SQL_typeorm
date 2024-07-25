import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddBlogsubscribersEntity1721878314935
  implements MigrationInterface
{
  name = 'AddBlogsubscribersEntity1721878314935';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "BlogSubscribers" ("blogSubscriberId" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "userId" uuid NOT NULL, "subscribeData" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_814dba034dd96ea03943defd6a6" PRIMARY KEY ("blogSubscriberId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogSubscribers" ADD CONSTRAINT "FK_96c57c0b19b617b8fa1e4fd4533" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogSubscribers" ADD CONSTRAINT "FK_049601a85dc817657b1fa1bf1e0" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "BlogSubscribers" DROP CONSTRAINT "FK_049601a85dc817657b1fa1bf1e0"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogSubscribers" DROP CONSTRAINT "FK_96c57c0b19b617b8fa1e4fd4533"`,
    );
    await queryRunner.query(`DROP TABLE "BlogSubscribers"`);
  }
}
