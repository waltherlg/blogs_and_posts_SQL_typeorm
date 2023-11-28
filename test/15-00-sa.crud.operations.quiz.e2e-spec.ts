import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';

export function questionCrudOperationsSa15() {
  describe('question CRUD operation SA (e2e)', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');

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

  });
}
