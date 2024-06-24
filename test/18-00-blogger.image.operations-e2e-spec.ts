import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { testUser } from './helpers/inputAndOutputObjects/usersObjects';
import { addAppSettings } from '../src/helpers/settings';
import { testInputBlogBody, testOutputBlogBody } from './helpers/inputAndOutputObjects/blogsObjects';
export function testBloggerImageOperation18() {
  describe('Blogger image operation "if all is ok" (e2e). ', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');

    let accessTokenUser1: any;
    let accessTokenUser2: any;

    beforeAll(async () => {
      const moduleFixture: TestingModule = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      const rawApp = moduleFixture.createNestApplication();
      app = addAppSettings(rawApp);
      await app.init();
    });
    afterAll(async () => {
      await app.close();
    });

    let firstCreatedBlogId: string;
    let createdPostId: string;
    let userId1: string;

    it('00-00 testing/all-data DELETE = 204 removeAllData', async () => {
      await request(app.getHttpServer())
        .delete(endpoints.wipeAllData)
        .expect(204);
    });

    it('00-01 sa/users post = 201 create user1 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser1)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId1 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser1Sa);
    });

    it('00-03 login user1 = 204 login user1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user1',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser1 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('01-05 blogger/blogs POST = 201 user1 create new blog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.blog1)
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      firstCreatedBlogId = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual(testOutputBlogBody.blog1);
    });

    it('01-07 blogger/blogs GET = 200 return users1 blogs with pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          testOutputBlogBody.blog1
        ],
      });
    });
  });
}