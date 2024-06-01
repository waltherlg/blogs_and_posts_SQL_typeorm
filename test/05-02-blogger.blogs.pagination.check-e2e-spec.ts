import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { testUser } from './helpers/inputAndOutputObjects/usersObjects';
import { addAppSettings } from '../src/helpers/settings';
import {
  testInputBlogBody,
  testOutputBlogBody,
} from './helpers/inputAndOutputObjects/blogsObjects';
export function testBloggerPaginationTest0502() {
  describe('Blogger Pagination test "if all is ok" (e2e). ', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
    const basicAuthWrongPassword =
      Buffer.from('admin:12345').toString('base64');
    const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

    let accessTokenUser1: any;
    let accessTokenUser2: any;
    let TimBlogId;
    let TimaBlogId;
    let TimmaBlogId;
    let timmBlogId;

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

    it('00-02 auth/registration = 204 register user2', async () => {
      await request(app.getHttpServer())
        .post(`${endpoints.auth}/registration`)
        .send({
          login: 'user2',
          password: 'qwerty',
          email: 'ruslan@gmail-2.com',
        })
        .expect(204);
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

    it('00-04 login user2 = 204 login user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user2',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser2 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('01-05 blogger/blogs POST = 201 user1 create new TimBlog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.Tim)
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      TimBlogId = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual(testOutputBlogBody.Tim);
    });

    it('01-05 blogger/blogs POST = 201 user1 create new TimaBlog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.Tima)
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      TimaBlogId = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual(testOutputBlogBody.Tima);
    });

    it('01-05 blogger/blogs POST = 201 user1 create new TimmaBlog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.Timma)
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      TimmaBlogId = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual(testOutputBlogBody.Timma);
    });

    it('01-05 blogger/blogs POST = 201 user1 create new timmBlog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.timm)
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      timmBlogId = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual(testOutputBlogBody.timm);
    });

    it('01-07 blogger/blogs GET = 200 return users1 blogs with pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.bloggerBlogs)
        .query({
          pageSize: 5,
          pageNumber: 1,
          searchNameTerm: 'Tim',
          sortDirection: 'asc',
          sortBy: 'name',
        })
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 5,
        totalCount: 4,
        items: [
          testOutputBlogBody.Tim,
          testOutputBlogBody.Tima,
          testOutputBlogBody.Timma,
          testOutputBlogBody.timm,
        ],
      });
    });
  });
}
