import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { testComments } from './helpers/inputAndOutputObjects/commentObjects';
export function commentLikesWithUserBanCrud1301() {
  describe('COmment Likes Crud CRUD operation "if all is ok" (e2e). ', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
    const basicAuthWrongPassword =
      Buffer.from('admin:12345').toString('base64');
    const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

    let accessTokenUser1: any;
    let accessTokenUser2: any;
    let accessTokenUser3: any;
    let accessTokenUser4: any;
    let accessTokenUser5: any;

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

    let userId2;
    let userId3;

    let BlogId1User1: string;
    let createdPostId: string;
    let createdCommentId1: string;
    let createdCommentId2: string;

    it('00-00 testing/all-data DELETE = 204 removeAllData', async () => {
      await request(app.getHttpServer())
        .delete(endpoints.wipeAllData)
        .expect(204);
    });

    it('00-00 auth/registration = 204 register user1', async () => {
      await request(app.getHttpServer())
        .post(`${endpoints.auth}/registration`)
        .send({
          login: 'user1',
          password: 'qwerty',
          email: 'ruslan@gmail-1.com',
        })
        .expect(204);
    });

    it('00-00 login user1 = 204 login user1', async () => {
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

    it('00-00 sa/users post = 201 create user2 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testComments.inputUser2)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId2 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testComments.outputUser2Sa);
    });

    it('00-00 login = 204 login user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testComments.loginUser2)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser2 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
      expect(createResponse.headers['set-cookie']).toBeDefined();
    });

    it('00-00 sa/users post = 201 create user3 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testComments.inputUser3)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId3 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testComments.outputUser3Sa);
    });

    it('00-00 login = 204 login user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testComments.loginUser3)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser3 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
      expect(createResponse.headers['set-cookie']).toBeDefined();
    });

    it('01-02 blogger/blogs POST = 201 user1 create new blog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        //.set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          name: 'BlogForPosts',
          description: 'description BlogForPosts',
          websiteUrl: 'https://www.someweb.com',
        })
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      BlogId1User1 = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual({
        id: BlogId1User1,
        name: 'BlogForPosts',
        description: 'description BlogForPosts',
        websiteUrl: 'https://www.someweb.com',
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('01-02 blogger/blogId/posts POST = 201 user1 create new post', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}/${BlogId1User1}/posts`)
        //.post(`${endpoints.posts}/${createdPostId}/comments`)
        //.set('Authorization', `Basic ${basicAuthRight}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          title: 'newCreatedPost',
          shortDescription: 'newPostsShortDescription',
          content: 'some content',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      createdPostId = createdResponse.id;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        title: 'newCreatedPost',
        shortDescription: 'newPostsShortDescription',
        content: 'some content',
        blogId: BlogId1User1,
        blogName: 'BlogForPosts',
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    });

    it('01-02 posts/postId/comments POST = 201 user1 create comment1 for post1', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.posts}/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          content: 'some comment for post1',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      createdCommentId1 = createdResponse.id;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('01-02 posts/postId/comments POST = 201 user2 create comment2 for post1', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.posts}/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          content: 'some comment2 for post1 from user2',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment2 for post1 from user2',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user2',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('01-06 /comments/commentId/like-status UPDATE = 204 like for comment1 from user1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId1}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('01-06 /comments/commentId/like-status UPDATE = 204 like for comment1 from user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId1}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('01-06 /comments/commentId/like-status UPDATE = 204 dislike for comment1 from user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId1}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('01-06 /comments/commentId/like-status UPDATE = 204 like for comment2 from user1 ', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId2}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('01-06 /comments/commentId/like-status UPDATE = 204 dislike for comment2 from user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId2}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('01-06 posts/:postId/comments GET = 200 get comments for post1', async () => {
      const testsResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${createdPostId}/comments`)
        //.set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: expect.any(String),
            content: 'some comment2 for post1 from user2',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user2',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 1,
              dislikesCount: 1,
              myStatus: 'None',
            },
          },
          {
            id: expect.any(String),
            content: 'some comment for post1',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user1',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 2,
              dislikesCount: 1,
              myStatus: 'None',
            },
          },
        ],
      });
    });

    it('01-06 /comments/commentId/like-status UPDATE = 204 dislike for comment1 from user1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId1}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('01-06 sa/users/:userId/ban UPDATE = 204 ban user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId3}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          isBanned: true,
          banReason: 'some ban reason for user2',
        })
        .expect(204);
    });

    it('01-06 posts/:postId/comments GET = 200 get comments for post1 after ban user3', async () => {
      const testsResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${createdPostId}/comments`)
        //.set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: expect.any(String),
            content: 'some comment2 for post1 from user2',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user2',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 1,
              dislikesCount: 0,
              myStatus: 'None',
            },
          },
          {
            id: expect.any(String),
            content: 'some comment for post1',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user1',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 1,
              dislikesCount: 1,
              myStatus: 'None',
            },
          },
        ],
      });
    });

    it('01-06 sa/users/:userId/ban UPDATE = 204 ban user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          isBanned: true,
          banReason: 'some ban reason for user2',
        })
        .expect(204);
    });

    it('01-06 posts/:postId/comments GET = 200 get comment1 for post1 after ban user2', async () => {
      const testsResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${createdPostId}/comments`)
        //.set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
            id: expect.any(String),
            content: 'some comment for post1',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user1',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 0,
              dislikesCount: 1,
              myStatus: 'None',
            },
          },
        ],
      });
    });

    it('01-06 sa/users/:userId/ban UPDATE = 204 unban user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId3}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          isBanned: false,
          banReason: 'some ban reason for user2',
        })
        .expect(204);
    });

    it('01-06 posts/:postId/comments GET = 200 get comment1 for post1 after unban user3', async () => {
      const testsResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${createdPostId}/comments`)
        //.set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
            id: expect.any(String),
            content: 'some comment for post1',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user1',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 0,
              dislikesCount: 2,
              myStatus: 'None',
            },
          },
        ],
      });
    });

    it('01-06 sa/users/:userId/ban UPDATE = 204 unban user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          isBanned: false,
          banReason: 'some ban reason for user2',
        })
        .expect(204);
    });

    it('01-06 posts/:postId/comments GET = 200 get comments for post1 after unban user2', async () => {
      const testsResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${createdPostId}/comments`)
        //.set('Authorization', `Bearer ${accessTokenUser3}`)
        .expect(200);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: expect.any(String),
            content: 'some comment2 for post1 from user2',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user2',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 1,
              dislikesCount: 1,
              myStatus: 'None',
            },
          },
          {
            id: expect.any(String),
            content: 'some comment for post1',
            commentatorInfo: {
              userId: expect.any(String),
              userLogin: 'user1',
            },
            createdAt: expect.any(String),
            likesInfo: {
              likesCount: 1,
              dislikesCount: 2,
              myStatus: 'None',
            },
          },
        ],
      });
    });
  });
}
