import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveJoynColumnForQuestionsInGame1704615031525 implements MigrationInterface {
    name = 'RemoveJoynColumnForQuestionsInGame1704615031525'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_a9ab32e1b7b8d208e440e54f21f"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_201006d173eed9e7e6480eec9cb"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_4907ac8fd1e83922d6151f31ee9"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_36ef7c79562385fc50027a095ec"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_52289f4915570c3867e08939383"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question1Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question2Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question3Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question4Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "question5Id"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "questions1QuestionId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "questions2QuestionId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "questions3QuestionId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "questions4QuestionId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "questions5QuestionId" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_a31c9ef5b7fcd81aaf00d00d06b" FOREIGN KEY ("questions1QuestionId") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_aeb91bb144313de2659fa4485bc" FOREIGN KEY ("questions2QuestionId") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_c9e64e4b71cc80662f2d450a694" FOREIGN KEY ("questions3QuestionId") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_9623fb5a8218f58ed325d70fd43" FOREIGN KEY ("questions4QuestionId") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_40584b8d615f613b7383bb29287" FOREIGN KEY ("questions5QuestionId") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_40584b8d615f613b7383bb29287"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_9623fb5a8218f58ed325d70fd43"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_c9e64e4b71cc80662f2d450a694"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_aeb91bb144313de2659fa4485bc"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP CONSTRAINT "FK_a31c9ef5b7fcd81aaf00d00d06b"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "questions5QuestionId"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "questions4QuestionId"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "questions3QuestionId"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "questions2QuestionId"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" DROP COLUMN "questions1QuestionId"`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question5Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question4Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question3Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question2Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD "question1Id" uuid`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_52289f4915570c3867e08939383" FOREIGN KEY ("question1Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_36ef7c79562385fc50027a095ec" FOREIGN KEY ("question2Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_4907ac8fd1e83922d6151f31ee9" FOREIGN KEY ("question3Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_201006d173eed9e7e6480eec9cb" FOREIGN KEY ("question4Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "QuizGames" ADD CONSTRAINT "FK_a9ab32e1b7b8d208e440e54f21f" FOREIGN KEY ("question5Id") REFERENCES "Questions"("questionId") ON DELETE SET NULL ON UPDATE CASCADE`);
    }

}
