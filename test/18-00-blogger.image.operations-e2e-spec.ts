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
import * as path from 'path';
import { testOutputImage } from './helpers/inputAndOutputObjects/imageObject';
import { testPosts } from './helpers/inputAndOutputObjects/postsObjects';

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
        items: [testOutputBlogBody.blog1],
      });
    });

    it('01-09 blogger/blogs/:blogId/image/wallpaper POST = 201 user1 upload wallpaper for blog', async () => {
      const imagePath = path.join(
        __dirname,
        'helpers',
        'uploadFiles',
        'blog_wallpaper.png',
      );
      const testsResponse = await request(app.getHttpServer())
        .post(
          `${endpoints.bloggerBlogs}/${firstCreatedBlogId}/images/wallpaper`,
        )
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .attach('file', imagePath)
        .expect(201);

      const createdResponse = testsResponse.body;

      expect(createdResponse).toEqual(testOutputImage.afterWallpaperLoad);
    });

    it('01-09 blogger/blogs/:blogId/image/main POST = 201 user1 upload main for blog', async () => {
      const imagePath = path.join(
        __dirname,
        'helpers',
        'uploadFiles',
        'blog_main.png',
      );
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}/${firstCreatedBlogId}/images/main`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .attach('file', imagePath)
        .expect(201);

      const createdResponse = testsResponse.body;

      expect(createdResponse).toEqual(
        testOutputImage.afterWallpaperAndMainLoad,
      );
    });

    it('01-02 blogger/blogId/posts POST = 201 user1 create new post', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}/${firstCreatedBlogId}/posts`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send(testPosts.inputBodyPost1forBlog1)
        .expect(201);

      const createdResponse = testsResponse.body;
      createdPostId = createdResponse.id;

      expect(createdResponse).toEqual(testPosts.outputPost1forBlog1);
    });

    it('01-02 blogger/blogId/posts/postId/images/main POST = 201 user1 upload main for post', async () => {
      const imagePath = path.join(
        __dirname,
        'helpers',
        'uploadFiles',
        'post_main.png',
      );
      const testsResponse = await request(app.getHttpServer())
        .post(
          `${endpoints.bloggerBlogs}/${firstCreatedBlogId}/posts/${createdPostId}/images/main`,
        )
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .attach('file', imagePath)
        .expect(201);

      // const createdResponse = testsResponse.body;
      // createdPostId = createdResponse.id;

      // expect(createdResponse).toEqual(testPosts.outputPost1forBlog1);
    });

    it('01-02 blogger/blogId/posts/postId/images/main POST = 400 user1 trying upload wrong file type', async () => {
      const imagePath = path.join(
        __dirname,
        'helpers',
        'uploadFiles',
        'textFile.txt',
      );
      const testsResponse = await request(app.getHttpServer())
        .post(
          `${endpoints.bloggerBlogs}/${firstCreatedBlogId}/posts/${createdPostId}/images/main`,
        )
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .attach('file', imagePath)
        .expect(400);
    });
  });
}
