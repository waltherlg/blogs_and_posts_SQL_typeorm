import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
//import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import {
  testUser,
  testUserPag,
} from './helpers/inputAndOutputObjects/usersObjects';
import { log } from 'console';
import {
  testInputBlogBody,
  testOutputBlogBody,
} from './helpers/inputAndOutputObjects/blogsObjects';
import { testBloggerBanBody } from './helpers/inputAndOutputObjects/usersObjects';
import { addAppSettings } from '../src/helpers/settings';

export function testBanUserForBlogByBlogger() {
  let accessTokenUser1;
  let accessTokenUser2;
  let accessTokenUser3;
  let blogId1;
  let blogId2;
  let blogId3;
  let userId1;
  let userId2;
  let userId3;
  let userId4;

  describe('test Ban User For Blog By Blogger (e2e)', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
    const basicAuthWrongPassword =
      Buffer.from('admin:12345').toString('base64');
    const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

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

    it('00-00 testing/all-data DELETE = 204 removeAllData', async () => {
      await request(app.getHttpServer())
        .delete(endpoints.wipeAllData)
        .expect(204);
    });

    it('01-01 sa/users GET = 200 return empty array with pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
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

    it('00-00 sa/users post = 201 create user1 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser1)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId1 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser1Sa);
    });

    it('00-00 sa/users post = 201 create user2 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser2)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId2 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser2Sa);
    });

    it('00-00 login = 204 login user1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testUser.loginUser1)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser1 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
      expect(createResponse.headers['set-cookie']).toBeDefined();
      const refreshTokenCookie = createResponse.headers['set-cookie'].find(
        (cookie) => cookie.startsWith('refreshToken='),
      );

      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('Secure');
    });

    it('00-00 login = 204 login user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testUser.loginUser2)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser2 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
      expect(createResponse.headers['set-cookie']).toBeDefined();
      const refreshTokenCookie = createResponse.headers['set-cookie'].find(
        (cookie) => cookie.startsWith('refreshToken='),
      );

      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('Secure');
    });

    it('00-00 sa/users post = 201 create user3 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser3)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId3 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser3Sa);
    });

    it('00-00 sa/users post = 201 create user4 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser4)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId4 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser4Sa);
    });

    it('00-00 login = 204 login user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testUser.loginUser3)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser3 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
      expect(createResponse.headers['set-cookie']).toBeDefined();
      const refreshTokenCookie = createResponse.headers['set-cookie'].find(
        (cookie) => cookie.startsWith('refreshToken='),
      );

      expect(refreshTokenCookie).toBeDefined();
      expect(refreshTokenCookie).toContain('HttpOnly');
      expect(refreshTokenCookie).toContain('Secure');
    });

    it('00-00 blogger/blogs POST = 201 user1 create blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.blog1)
        .expect(201);
      const createdResponseBody = createResponse.body;
      blogId1 = createdResponseBody.id;
      expect(createdResponseBody).toEqual(testOutputBlogBody.blog1);
    });

    it('00-00 blogger/blogs POST = 201 user1 create blog2', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testInputBlogBody.blog2)
        .expect(201);
      const createdResponseBody = createResponse.body;
      blogId2 = createdResponseBody.id;
      expect(createdResponseBody).toEqual(testOutputBlogBody.blog2);
    });

    it('00-00 blogger/blogs POST = 201 user3 create blog3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send(testInputBlogBody.blog3)
        .expect(201);
      const createdResponseBody = createResponse.body;
      blogId3 = createdResponseBody.id;
      expect(createdResponseBody).toEqual(testOutputBlogBody.blog3);
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user1 ban user2 for blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId2}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId1,
        })
        .expect(204);
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user3 ban user2 for blog3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId2}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId3,
        })
        .expect(204);
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user3 ban user1 for blog3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId1}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId3,
        })
        .expect(204);
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user3 ban user4 for blog3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId4}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId3,
        })
        .expect(204);
    });

    it('00-00 blogger/users/blog/:blogId GET = 200 array of banned users for blog3', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.bloggerUsers}/blog/${blogId3}`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);
      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 3,
        items: [
          testBloggerBanBody.bannedUser4ForBlogOutput,
          testBloggerBanBody.bannedUser1ForBlogOutput,
          testBloggerBanBody.bannedUser2ForBlogOutput,
        ],
      });
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user1 ban user2 for blog2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId2}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog2',
          blogId: blogId2,
        })
        .expect(204);
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user1 ban user3 for blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId3}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId1,
        })
        .expect(204);
    });

    it('00-00 blogger/users/blog/:blogId GET = 200 array of banned users for blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.bloggerUsers}/blog/${blogId1}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          testBloggerBanBody.bannedUser3ForBlogOutput,
          testBloggerBanBody.bannedUser2ForBlogOutput,
        ],
      });
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user1 UNban user3 for blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId3}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          isBanned: false,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId1,
        })
        .expect(204);
    });

    it('00-00 blogger/users/blog/:blogId GET = 200 array of banned users for blog1 after unban user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.bloggerUsers}/blog/${blogId1}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [testBloggerBanBody.bannedUser2ForBlogOutput],
      });
    });

    it('00-00 blogger/users/:userId/ban PUT = 204 user1 ban user3 for blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.bloggerUsers}/${userId3}/ban`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          isBanned: true,
          banReason: 'some reason for ban user for this blog',
          blogId: blogId1,
        })
        .expect(204);
    });
  });
}
