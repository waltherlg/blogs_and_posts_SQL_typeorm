import { MigrationInterface, QueryRunner } from "typeorm";

export class FixRelCommentLikes21699461936333 implements MigrationInterface {
    name = 'FixRelCommentLikes21699461936333'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "REL_d9e6da41ef57e1b3ce506fb344"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "REL_83329f810e6a76c0eb6dc690d2"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "PK_0d7d34e2ab9319b05fc35e114ab"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD "commentId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "PK_0d7d34e2ab9319b05fc35e114ab" PRIMARY KEY ("commentId")`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f" FOREIGN KEY ("commentId") REFERENCES "Comments"("commentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "FK_0d7d34e2ab9319b05fc35e114ab" FOREIGN KEY ("commentId") REFERENCES "CommentLikes"("commentLikeId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "FK_0d7d34e2ab9319b05fc35e114ab"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a"`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" DROP CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP CONSTRAINT "PK_0d7d34e2ab9319b05fc35e114ab"`);
        await queryRunner.query(`ALTER TABLE "Comments" DROP COLUMN "commentId"`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD "commentId" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "Comments" ADD CONSTRAINT "PK_0d7d34e2ab9319b05fc35e114ab" PRIMARY KEY ("commentId")`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "REL_83329f810e6a76c0eb6dc690d2" UNIQUE ("userId")`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "REL_d9e6da41ef57e1b3ce506fb344" UNIQUE ("commentId")`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_83329f810e6a76c0eb6dc690d2a" FOREIGN KEY ("userId") REFERENCES "Users"("userId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "CommentLikes" ADD CONSTRAINT "FK_d9e6da41ef57e1b3ce506fb344f" FOREIGN KEY ("commentId") REFERENCES "Comments"("commentId") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
