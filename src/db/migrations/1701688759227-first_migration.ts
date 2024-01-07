import { MigrationInterface, QueryRunner } from 'typeorm';

export class FirstMigration1701688759227 implements MigrationInterface {
  name = 'FirstMigration1701688759227';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "PostLikes" ("postLikeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "postId" uuid NOT NULL, "addedAt" character varying NOT NULL, "userId" uuid NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_de839d8cc3a6e5cc891b7e9635c" PRIMARY KEY ("postLikeId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "CommentLikes" ("commentLikeId" uuid NOT NULL DEFAULT uuid_generate_v4(), "commentId" uuid NOT NULL, "addedAt" character varying NOT NULL, "userId" uuid NOT NULL, "status" character varying NOT NULL, CONSTRAINT "PK_9974eb5d080e8c3e91f2e0158fc" PRIMARY KEY ("commentLikeId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Comments" ("commentId" uuid NOT NULL, "postId" uuid NOT NULL, "content" character varying NOT NULL, "createdAt" character varying NOT NULL, "userId" uuid NOT NULL, "likesCount" integer NOT NULL, "dislikesCount" integer NOT NULL, CONSTRAINT "PK_0d7d34e2ab9319b05fc35e114ab" PRIMARY KEY ("commentId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Posts" ("postId" uuid NOT NULL, "title" character varying NOT NULL, "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "blogId" uuid NOT NULL, "createdAt" character varying NOT NULL, "userId" uuid, "likesCount" integer NOT NULL, "dislikesCount" integer NOT NULL, CONSTRAINT "PK_4d9bf827a35a42cc2c38df230ea" PRIMARY KEY ("postId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Blogs" ("blogId" uuid NOT NULL, "name" character varying NOT NULL, "isBlogBanned" boolean NOT NULL, "blogBanDate" character varying, "userId" uuid, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "createdAt" character varying NOT NULL, "isMembership" boolean NOT NULL, CONSTRAINT "PK_bbf4cf97f2bc82ae204a91296eb" PRIMARY KEY ("blogId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "BlogBannedUsers" ("banId" uuid NOT NULL DEFAULT uuid_generate_v4(), "blogId" uuid NOT NULL, "userId" uuid NOT NULL, "banDate" character varying NOT NULL, "banReason" character varying NOT NULL, CONSTRAINT "PK_8e1b74fc0443955bf7b73593e2c" PRIMARY KEY ("banId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "UserDevices" ("deviceId" uuid NOT NULL, "userId" uuid NOT NULL, "ip" character varying NOT NULL, "title" character varying NOT NULL, "lastActiveDate" TIMESTAMP WITH TIME ZONE NOT NULL, "expirationDate" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_b9160b9f2241d85a64da3615805" PRIMARY KEY ("deviceId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Users" ("userId" uuid NOT NULL, "login" character varying NOT NULL, "passwordHash" character varying NOT NULL, "email" character varying NOT NULL, "createdAt" character varying NOT NULL, "isUserBanned" boolean NOT NULL, "banDate" character varying, "banReason" character varying, "confirmationCode" character varying, "expirationDateOfConfirmationCode" TIMESTAMP WITH TIME ZONE, "isConfirmed" boolean NOT NULL, "passwordRecoveryCode" character varying, "expirationDateOfRecoveryCode" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a06d29e81a4b836dddfd684ab87" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "Questions" ("questionId" uuid NOT NULL, "body" character varying NOT NULL, "correctAnswers" jsonb NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL, "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL, CONSTRAINT "PK_13221c506f69d8e080bcbfff947" PRIMARY KEY ("questionId"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostLikes" ADD CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891" FOREIGN KEY ("postId") REFERENCES "Posts"("postId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostLikes" ADD CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f" FOREIGN KEY ("commentId") REFERENCES "Comments"("commentId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d" FOREIGN KEY ("postId") REFERENCES "Posts"("postId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" ADD CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" ADD CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogBannedUsers" ADD CONSTRAINT "FK_dd3b167580f78966c582e5f54b3" FOREIGN KEY ("blogId") REFERENCES "Blogs"("blogId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogBannedUsers" ADD CONSTRAINT "FK_19cb7e96476f86fd5d414aff8a2" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "UserDevices" ADD CONSTRAINT "FK_4763e47aa692606f486c38cd381" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "UserDevices" DROP CONSTRAINT "FK_4763e47aa692606f486c38cd381"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogBannedUsers" DROP CONSTRAINT "FK_19cb7e96476f86fd5d414aff8a2"`,
    );
    await queryRunner.query(
      `ALTER TABLE "BlogBannedUsers" DROP CONSTRAINT "FK_dd3b167580f78966c582e5f54b3"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Posts" DROP CONSTRAINT "FK_3d48d13b4578bccfbda468b1c4c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_aa80cd9ae4c341f0aeba2401b10"`,
    );
    await queryRunner.query(
      `ALTER TABLE "Comments" DROP CONSTRAINT "FK_68844d71da70caf0f0f4b0ed72d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostLikes" DROP CONSTRAINT "FK_a931f62e10da42b6a74f7a4fe79"`,
    );
    await queryRunner.query(
      `ALTER TABLE "PostLikes" DROP CONSTRAINT "FK_acad3c28cf8d94318cf07d2c891"`,
    );
    await queryRunner.query(`DROP TABLE "Questions"`);
    await queryRunner.query(`DROP TABLE "Users"`);
    await queryRunner.query(`DROP TABLE "UserDevices"`);
    await queryRunner.query(`DROP TABLE "BlogBannedUsers"`);
    await queryRunner.query(`DROP TABLE "Blogs"`);
    await queryRunner.query(`DROP TABLE "Posts"`);
    await queryRunner.query(`DROP TABLE "Comments"`);
    await queryRunner.query(`DROP TABLE "CommentLikes"`);
    await queryRunner.query(`DROP TABLE "PostLikes"`);
  }
}
