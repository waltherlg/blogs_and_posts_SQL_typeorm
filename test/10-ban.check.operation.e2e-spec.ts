import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { endpoints } from './helpers/routing';
import { testUser } from './helpers/inputAndOutputObjects/usersObjects';
import { addAppSettings } from '../src/helpers/settings';
export function banCheckOperation() {
  describe('Checking User Ban for Get Requests (e2e). ', () => {
    let app: INestApplication;

    // likes for comment ban check
    // user2 like - likes 1 dislikes 0
    // user3 like - likes 2 dislikes 0
    // user4 disl - likes 2 dislikes 1
    // user5 disl - likes 2 dislikes 2
    // user4 like - likes 3 dislikes 1
    // user5 like - likes 4 dislikes 0
    // user5 disl - likes 3 dislikes 1
    // user2 none - likes 2 dislikes 1
    // user2 like - likes 3 dislikes 1
    // after ban user2 - likes 2 dislikes 1
    // after ban user5 - likes 2 dislikes 0
    // after ban user4 - likes 1 dislikes 0
    // after ban user3 - likes 0 dislikes 0
    // after unban user3 - likes 1 dislikes 0
    // after unban user2,5,4 likes 3 dislikes 1

    //likes for post ban check

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

      const rawApp = moduleFixture.createNestApplication();
      app = addAppSettings(rawApp);
      await app.init();
    });
    afterAll(async () => {
      await app.close();
    });

    let BlogId1User1: string;
    let PostId1User1: string;
    let createdCommentId: string;
    let createdCommentId2;

    let userId1: string;
    let userId2: string;
    let userId3: string;
    let userId4: string;
    let userId5: string;

    it('00-00 testing/all-data DELETE = 204 removeAllData', async () => {
      await request(app.getHttpServer())
        .delete(endpoints.wipeAllData)
        .expect(204);
    });

    it('01-00 auth/registration = 204 register user1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.saUsers}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          login: 'user1',
          password: 'qwerty',
          email: 'ruslan@gmail-1.com',
        })
        .expect(201);
      const createdResponse = createResponse.body;
      userId1 = createdResponse.id;
    });

    it('02-00 login user1 = 204 login user1', async () => {
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

    it('03-00 auth/registration = 204 register user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.saUsers}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          login: 'user2',
          password: 'qwerty',
          email: 'ruslan@gmail-2.com',
        })
        .expect(201);
      const createdResponse = createResponse.body;
      userId2 = createdResponse.id;
    });

    it('04-00 login user2 = 204 login user2', async () => {
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

    it('05-00 auth/registration = 204 register user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.saUsers}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          login: 'user3',
          password: 'qwerty',
          email: 'ruslan@gmail-3.com',
        })
        .expect(201);
      const createdResponse = createResponse.body;
      userId3 = createdResponse.id;
    });

    it('06-00 login user3 = 204 login user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user3',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser3 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('07-00 auth/registration = 204 register user4', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.saUsers}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          login: 'user4',
          password: 'qwerty',
          email: 'ruslan@gmail-4.com',
        })
        .expect(201);
      const createdResponse = createResponse.body;
      userId4 = createdResponse.id;
    });

    it('08-00 login user4 = 204 login user4', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user4',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser4 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('09-00 auth/registration = 204 register user5', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.saUsers}`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({
          login: 'user5',
          password: 'qwerty',
          email: 'ruslan@gmail-5.com',
        })
        .expect(201);
      const createdResponse = createResponse.body;
      userId5 = createdResponse.id;
    });

    it('10-00 login user5 = 204 login user5', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user5',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser5 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('11-00 blogger/blogs POST = 201 user1 create new blog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
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

    let BlogId1User2: string;

    it('12-02 blogger/blogs POST = 201 user2 create new blog', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(endpoints.bloggerBlogs)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          name: 'Blog1User2',
          description: 'description BlogForPosts',
          websiteUrl: 'https://www.someweb.com',
        })
        .expect(201);

      const createdResponseOfFirstBlog = testsResponse.body;
      BlogId1User2 = createdResponseOfFirstBlog.id;

      expect(createdResponseOfFirstBlog).toEqual({
        id: expect.any(String),
        name: 'Blog1User2',
        description: 'description BlogForPosts',
        websiteUrl: 'https://www.someweb.com',
        createdAt: expect.any(String),
        isMembership: false,
      });
    });

    it('13-02 blogger/blogId/posts POST = 201 user1 create new post', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}/${BlogId1User1}/posts`)
        //.post(`${endpoints.posts}/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          title: 'newCreatedPost',
          shortDescription: 'newPostsShortDescription',
          content: 'some content',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      PostId1User1 = createdResponse.id;

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

    let PostId1User2: string;

    it('14-02 blogger/blogId/posts POST = 201 user2 create new post', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.bloggerBlogs}/${BlogId1User2}/posts`)
        //.post(`${endpoints.posts}/${createdPostId}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          title: 'BannedPost',
          shortDescription: 'newPostsShortDescription',
          content: 'some content',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      PostId1User2 = createdResponse.id;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        title: 'BannedPost',
        shortDescription: 'newPostsShortDescription',
        content: 'some content',
        blogId: expect.any(String),
        blogName: 'Blog1User2',
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 0,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [],
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('01-05 /posts GET = 200 return all Posts with pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.posts)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          {
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
          },
        ],
      });
    });

    it('16-08 sa/users/userId/ban PUT = 204 unBan user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUnbanUser)
        .expect(204);
    });

    it('16-00 login user2 = 204 login user2', async () => {
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

    it('01-05 /posts GET = 200 return 2 Posts with pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.posts)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          {
            id: expect.any(String),
            title: 'BannedPost',
            shortDescription: 'newPostsShortDescription',
            content: 'some content',
            blogId: expect.any(String),
            blogName: 'Blog1User2',
            createdAt: expect.any(String),
            extendedLikesInfo: {
              likesCount: 0,
              dislikesCount: 0,
              myStatus: 'None',
              newestLikes: [],
            },
          },
          {
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
          },
        ],
      });
    });

    it('17-02 posts/postId/comments POST = 201 user1 create new comment', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.posts}/${PostId1User1}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .send({
          content: 'some comment for post1',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      createdCommentId = createdResponse.id;

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

    it('18-02 posts/postId/comments POST = 201 user2 create new comment', async () => {
      const testsResponse = await request(app.getHttpServer())
        .post(`${endpoints.posts}/${PostId1User1}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          content: 'some comment for post1',
        })
        .expect(201);

      const createdResponse = testsResponse.body;
      createdCommentId2 = createdResponse.id;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
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

    it('19-06 /comments/commentId/like-status UPDATE = 204 like from user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('20-06 /comments/commentId/like-status UPDATE = 204 like from user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser3}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('21-06 /comments/commentId/like-status UPDATE = 204 Dislike from user4', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser4}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('22-06 /comments/commentId/like-status UPDATE = 204 Dislike from user5', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser5}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('23-07 /comments GET = 200 return commment for unauth user with 2 like and 2 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 2,
          dislikesCount: 2,
          myStatus: 'None',
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('23-07 /comments GET = 200 return commment for unauth user with 1 like (after ban user2) and 2 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
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
      });
    });

    it('16-08 sa/users/userId/ban PUT = 204 unBan user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUnbanUser)
        .expect(204);
    });

    it('16-00 login user2 = 204 login user2', async () => {
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

    it('23-07 /comments GET = 200 return commment for unauth user with 2 like (after unban user2) and 2 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 2,
          dislikesCount: 2,
          myStatus: 'None',
        },
      });
    });

    it('24-06 /comments/commentId/like-status UPDATE = 204 Like from user4', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser4}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('25-06 /comments/commentId/like-status UPDATE = 204 Like from user5', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser5}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('26-07 /comments GET = 200 return post for auth user2 with 4 like and 3 last liked users', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 4,
          dislikesCount: 0,
          myStatus: 'Like',
        },
      });
    });

    it('27-06 /comments/commentId/like-status UPDATE = 204 Dislike from user5', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser5}`)
        .send({
          likeStatus: 'Dislike',
        })
        .expect(204);
    });

    it('28-06 /comments/commentId/like-status UPDATE = 204 None from user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          likeStatus: 'None',
        })
        .expect(204);
    });

    it('29-07 /comments GET = 200 return comment for auth user5 with 2 like and 1 dislike, 2 last liked users, and my status Dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .set('Authorization', `Bearer ${accessTokenUser5}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
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
          myStatus: 'Dislike',
        },
      });
    });

    it('29-09 /comments/commentId DELETE = user2 delete own comment', async () => {
      const createResponse = await request(app.getHttpServer())
        .delete(`${endpoints.comments}/${createdCommentId2}`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(204);
    });

    it('30-07 posts/postId/comments GET = 200 user5 get comments by postId with status Dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${PostId1User1}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser5}`)
        .expect(200);
      const createdResponse = createResponse.body;

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
              likesCount: 2,
              dislikesCount: 1,
              myStatus: 'Dislike',
            },
          },
        ],
      });
    });

    it('31-07 posts/postId/comments GET = 200 user4 get comments by postId with status Like', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${PostId1User1}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser4}`)
        .expect(200);
      const createdResponse = createResponse.body;

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
              likesCount: 2,
              dislikesCount: 1,
              myStatus: 'Like',
            },
          },
        ],
      });
    });

    it('32-07 posts/postId/comments GET = 200 user2 get comments by postId with status None', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${PostId1User1}/comments`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
      const createdResponse = createResponse.body;

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
              likesCount: 2,
              dislikesCount: 1,
              myStatus: 'None',
            },
          },
        ],
      });
    });

    it('28-06 /comments/commentId/like-status UPDATE = 204 Like from user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.comments}/${createdCommentId}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 3 like and 1 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 3,
          dislikesCount: 1,
          myStatus: 'None',
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 2 like and 1 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
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
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user5', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId5}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 2 like and 0 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 2,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user4', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId4}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 1 like and 0 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user3', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId3}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 0 like and 0 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

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

    it('15-08 sa/users/userId/ban PUT = 204 unban user3', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId3}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUnbanUser)
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 1 like and 0 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 unban user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUnbanUser)
        .expect(204);
    });

    it('15-08 sa/users/userId/ban PUT = 204 unban user5', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId5}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUnbanUser)
        .expect(204);
    });

    it('15-08 sa/users/userId/ban PUT = 204 unban user4', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId4}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputUnbanUser)
        .expect(204);
    });

    it('33-00 /comments GET = 200 return comment for unauth user with 3 like and 1 dislike', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.comments}/${createdCommentId}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        content: 'some comment for post1',
        commentatorInfo: {
          userId: expect.any(String),
          userLogin: 'user1',
        },
        createdAt: expect.any(String),
        likesInfo: {
          likesCount: 3,
          dislikesCount: 1,
          myStatus: 'None',
        },
      });
    });

    it('01-05 /posts/postId GET = 200 return Posts1', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${PostId1User1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        title: 'newCreatedPost',
        shortDescription: 'newPostsShortDescription',
        content: 'some content',
        blogId: expect.any(String),
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

    it('16-00 login user2 = 204 login user2', async () => {
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

    it('16-00 login user3 = 204 login user3', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user3',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser3 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('16-00 login user4 = 204 login user4', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user4',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser4 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('16-00 login user5 = 204 login user5', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send({
          loginOrEmail: 'user5',
          password: 'qwerty',
        })
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser5 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
    });

    it('28-06 posts/postId/like-status UPDATE = 204 Like from user2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.posts}/${PostId1User1}/like-status`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .send({
          likeStatus: 'Like',
        })
        .expect(204);
    });

    it('01-05 /posts/postId GET = 200 return Posts1 with 1 like', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${PostId1User1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        title: 'newCreatedPost',
        shortDescription: 'newPostsShortDescription',
        content: 'some content',
        blogId: expect.any(String),
        blogName: 'BlogForPosts',
        createdAt: expect.any(String),
        extendedLikesInfo: {
          likesCount: 1,
          dislikesCount: 0,
          myStatus: 'None',
          newestLikes: [expect.any(Object)],
        },
      });
    });

    it('15-08 sa/users/userId/ban PUT = 204 ban user2', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${userId2}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('01-05 /posts/postId GET = 200 return Posts1 with 0 like', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.posts}/${PostId1User1}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        id: expect.any(String),
        title: 'newCreatedPost',
        shortDescription: 'newPostsShortDescription',
        content: 'some content',
        blogId: expect.any(String),
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
  });
}
