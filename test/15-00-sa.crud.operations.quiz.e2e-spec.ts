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
    let questionId1

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

  });
}
