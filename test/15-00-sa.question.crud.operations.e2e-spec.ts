import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { testQuestions } from './helpers/inputAndOutputObjects/questionObjects';

export function questionCrudOperationsSa15() {
  describe('question CRUD operation SA (e2e)', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
    let questionId1;
    let questionId2;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });
    afterAll(async () => {
      await app.close();
    });

    it('00-00 testing/all-data DELETE = 204 removeAllData', async () => {
      await request(app.getHttpServer())
        .delete(endpoints.wipeAllData)
        .expect(204);
    });

    it('01-01 quiz/questions GET = 200 return empty array with pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 0,
        page: 1,
        pageSize: 10,
        totalCount: 0,
        items: [],
      });
    });

    it('00-00 quiz/questions POST = 201 create question1 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion1)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId1 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion1Sa);
    });

    it('00-00 quiz/questions POST = 201 create question2 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion2)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId2 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion2Sa);
    });

    it('01-01 quiz/questions GET = 200 return array with 2 questions pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          testQuestions.outputQuestion2Sa,
          testQuestions.outputQuestion1Sa,
        ],
      });
    });

    it('00-00 quiz/questions/:questionId DELETE = 204 delete question2', async () => {
      const createResponse = await request(app.getHttpServer())
        .delete(`${endpoints.quizQuestions}/${questionId2}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(204);
    });

    it('01-01 quiz/questions GET = 200 return array with question1 after delete question2', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          testQuestions.outputQuestion1Sa,
        ],
      });
    });

    it('00-00 quiz/questions PUT = 201 update question1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId1}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.updateQuestion1)
        .expect(204);
    });

    it('01-01 quiz/questions GET = 200 return array with question1 after update', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          testQuestions.updatedOutputQuestion1Sa,
        ],
      });
      const question = createdResponse.items[0];
      expect(question.createdAt).not.toEqual(question.updatedAt);
    });

  });
}
