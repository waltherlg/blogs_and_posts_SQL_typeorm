import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { testUser } from './helpers/inputAndOutputObjects/usersObjects';
import { testPosts } from './helpers/inputAndOutputObjects/postsObjects';
import { addAppSettings } from '../src/helpers/settings';
import { BlogTypeOutput, enumSubscriptionStatus } from '../src/blogs/blogs.types';
const lodash = require('lodash');
export function userSubscribeBlogTest_19() {
  describe(' ----- userSubscribeBlogTest_19 (e2e) ----- ', () => {
    let accessTokenUser1;
    let accessTokenUser2;
    let accessTokenUser3;
    let blogId1;
    let blogId2;
    let userId1;
    let userId2;
    let userId3;
    let postId1;
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');

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

    it('00-02 sa/users post = 201 create user2 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser2)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId2 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser2Sa);
    });

    it('00-02 sa/users post = 201 create user3 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUser3)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId3 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUser.outputUser3Sa);
    });

    it('00-03 login = 204 login user1', async () => {
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
    });

    it('00-04 login = 204 login user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testUser.loginUser2)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser2 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('00-04 login = 204 login user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testUser.loginUser3)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser3 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });
    
    let newoutputBodyBlog1: BlogTypeOutput = lodash.cloneDeep(testPosts.outputBodyBlog1);

    it('00-05 blogger/blogs POST = 201 user1 create blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testPosts.inputBodyBlog1)
        .expect(201);
      const createdResponseBody = createResponse.body;
      blogId1 = createdResponseBody.id;
      expect(createdResponseBody).toEqual(testPosts.outputBodyBlog1);
      
      newoutputBodyBlog1.subscribersCount = 0
      newoutputBodyBlog1.currentUserSubscriptionStatus = enumSubscriptionStatus.None
    });

    
    it('00-07 blogger/blogs/{blogId}/posts POST = 201 user1 create post1 for blog1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}/${blogId1}/posts`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testPosts.inputBodyPost1forBlog1)
        .expect(201);
      const createdResponseBody = createResponse.body;
      postId1 = createdResponseBody.id;
      expect(createdResponseBody).toEqual(testPosts.outputPost1forBlog1);
    });

    

    it('01-07 blogs GET = 200 return blog1 with 0 sub and subStatus None', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });
    });
    
    it('00-08 blogs/{blogId}/subscription POST = 204 user2 subscribe to blog1', async () => {
      await request(app.getHttpServer())
        .post(`${endpoints.blogs}/${blogId1}/subscription`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(204);
        newoutputBodyBlog1.subscribersCount = 1;
    });


    it('01-07 blogs GET = 200 return blog1 with 1 sub and stat None', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponse = createResponse.body;
      
      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });
    });

    it('00-08 blogs/{blogId}/subscription POST = 204 user3 subscribe to blog1', async () => {
      await request(app.getHttpServer())
        .post(`${endpoints.blogs}/${blogId1}/subscription`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(204);
        newoutputBodyBlog1.subscribersCount = 2;
    });

    it('01-07 blogs GET = 200 return blog1 with 2 sub', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });
    });

    it('00-08 blogs/{blogId}/subscription POST = 204 user2 unSubscribe from blog1', async() => {
      await request(app.getHttpServer())
      .delete(`${endpoints.blogs}/${blogId1}/subscription`)
      .set('Authorization', `Bearer ${accessTokenUser2}`)
      .expect(204)
      newoutputBodyBlog1.subscribersCount = 1;
    })

    it('01-07 blogs GET = 200 return blog1 with 1 sub', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });

      newoutputBodyBlog1.currentUserSubscriptionStatus = enumSubscriptionStatus.Unsubscribed
    });

    it('01-07 blogs GET = 200 return blog1 for user 2 with 1 sub and stat unsubscribe', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
      const createdResponse = createResponse.body;
      
      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });
      newoutputBodyBlog1.currentUserSubscriptionStatus = enumSubscriptionStatus.Subscribed
    });

    it('01-07 blogs GET = 200 return blog1 for user 3 with 1 sub and stat subscribe', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);
      const createdResponse = createResponse.body;
      
      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });
    });

    it('00-08 blogs/{blogId}/subscription POST = 204 user2 Subscribe to blog1', async() => {
      await request(app.getHttpServer())
      .post(`${endpoints.blogs}/${blogId1}/subscription`)
      .set('Authorization', `Bearer ${accessTokenUser2}`)
      .expect(204)
      newoutputBodyBlog1.subscribersCount = 2;
    })

    it('01-07 blogs GET = 200 return blog1 for user 2 with 2 sub and stat subscribe', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.blogs)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
      const createdResponse = createResponse.body;
      
      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [newoutputBodyBlog1],
      });
    });

  });
}
