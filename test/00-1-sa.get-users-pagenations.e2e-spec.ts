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

export function testSaUsersGetWithPagination() {
  describe('sa users getting with pagination (e2e)', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
    const basicAuthWrongPassword =
      Buffer.from('admin:12345').toString('base64');
    const basicAuthWrongLogin = Buffer.from('12345:qwerty').toString('base64');

    let userId1: string;

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

    it('00-00 sa/users post = 201 create user mmmnnnooo with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUserPag.inputUsermmmnnnooo)
        .expect(201);

      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual(testUserPag.outputUserSammmnnnooo);
    });

    let idUsereeefffggg;

    it('00-00 sa/users post = 201 create user eeefffggg with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUserPag.inputUsereeefffggg)
        .expect(201);

      const createdResponseBody = createResponse.body;
      idUsereeefffggg = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUserPag.outputUserSaeeefffggg);
    });

    it('00-00 sa/users post = 201 create user aaabbbccc with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUserPag.inputUseraaabbbccc)
        .expect(201);

      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual(testUserPag.outputUserSaaaabbbccc);
    });

    it('00-00 sa/users post = 201 create user qqqrrrsss with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUserPag.inputUserqqqrrrsss)
        .expect(201);

      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual(testUserPag.outputUserSaqqqrrrsss);
    });

    let idUseriiijjjkkk;

    it('00-00 sa/users post = 201 create user iiijjjkkk with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUserPag.inputUseriiijjjkkk)
        .expect(201);

      const createdResponseBody = createResponse.body;
      idUseriiijjjkkk = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testUserPag.outputUserSaiiijjjkkk);
    });

    it('00-00 sa/users post = 201 create user aaafffkkk with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUserPag.inputUseraaafffkkk)
        .expect(201);

      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual(testUserPag.outputUserSaaaafffkkk);
    });

    it('01-01 sa/users GET = 200 return array with 5 users by createdAt desc', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: [
          testUserPag.outputUserSaaaafffkkk,
          testUserPag.outputUserSaiiijjjkkk,
          testUserPag.outputUserSaqqqrrrsss,
          testUserPag.outputUserSaaaabbbccc,
          testUserPag.outputUserSaeeefffggg,
          testUserPag.outputUserSammmnnnooo,
        ],
      });
    });

    it('01-01 sa/users GET = 200 return array with 5 users by login ASC', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({ sortBy: 'login', sortDirection: 'asc' })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: [
          testUserPag.outputUserSaaaabbbccc,
          testUserPag.outputUserSaaaafffkkk,
          testUserPag.outputUserSaeeefffggg,
          testUserPag.outputUserSaiiijjjkkk,
          testUserPag.outputUserSammmnnnooo,
          testUserPag.outputUserSaqqqrrrsss,
        ],
      });
    });

    it('01-01 sa/users GET = 200 return with 3 users by searchLoginTerm "aaa" ASC and searchEmailTerm: "pppppp"', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({
          searchEmailTerm: 'pppppp',
          searchLoginTerm: 'aaa',
          sortBy: 'login',
          sortDirection: 'asc',
        })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 3,
        items: [
          testUserPag.outputUserSaaaabbbccc,
          testUserPag.outputUserSaaaafffkkk,
          testUserPag.outputUserSammmnnnooo
        ],
      });
    });

    it('01-01 sa/users GET = 200 return with 3 users by searchEmailTerm: "pppppp"', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({
          searchEmailTerm: 'pppppp',
          sortBy: 'login',
          sortDirection: 'asc',
        })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 1,
        items: [
          testUserPag.outputUserSammmnnnooo
        ],
      });
    });

    it('00-00 sa/users PUT = 204 ban user iiijjjkkk', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${idUseriiijjjkkk}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('00-00 sa/users PUT = 204 ban user iiijjjkkk', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${idUseriiijjjkkk}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('00-00 sa/users PUT = 204 ban user eeefffggg', async () => {
      await request(app.getHttpServer())
        .put(`${endpoints.saUsers}/${idUsereeefffggg}/ban`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testUser.inputBanUser)
        .expect(204);
    });

    it('01-01 sa/users GET = 200 return array with 2 banned users by login ASC', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({ sortBy: 'login', sortDirection: 'asc', banStatus: 'banned' })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 2,
        items: [
          testUserPag.outputUserSaeeefffgggBanned,
          testUserPag.outputUserSaiiijjjkkkBanned,
        ],
      });
    });

    it('01-01 sa/users GET = 200 return array with 4 not banned users by login ASC', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({
          sortBy: 'login',
          sortDirection: 'asc',
          banStatus: 'notBanned',
        })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 4,
        items: [
          testUserPag.outputUserSaaaabbbccc,
          testUserPag.outputUserSaaaafffkkk,
          testUserPag.outputUserSammmnnnooo,
          testUserPag.outputUserSaqqqrrrsss,
        ],
      });
    });

    it('01-01 sa/users GET = 200 return 6 users by login DESC', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({ sortBy: 'login', banStatus: 'all' })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: [
          testUserPag.outputUserSaqqqrrrsss,
          testUserPag.outputUserSammmnnnooo,
          testUserPag.outputUserSaiiijjjkkkBanned,
          testUserPag.outputUserSaeeefffgggBanned,
          testUserPag.outputUserSaaaafffkkk,
          testUserPag.outputUserSaaaabbbccc,
        ],
      });
    });

    it('01-01 sa/users GET = 200 return 2 users on page with 3 page count by login DESC', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({ sortBy: 'login', pageSize: 2 })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 3,
        page: 1,
        pageSize: 2,
        totalCount: 6,
        items: [
          testUserPag.outputUserSaqqqrrrsss,
          testUserPag.outputUserSammmnnnooo,
        ],
      });
    });

    it('01-01 sa/users GET = 200 return 3 users on 2 page with 2 page count by login ASC', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.saUsers)
        .query({
          sortBy: 'login',
          sortDirection: 'asc',
          pageSize: 3,
          pageNumber: 2,
        })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponseBody = createResponse.body;

      expect(createdResponseBody).toEqual({
        pagesCount: 2,
        page: 2,
        pageSize: 3,
        totalCount: 6,
        items: [
          testUserPag.outputUserSaiiijjjkkkBanned,
          testUserPag.outputUserSammmnnnooo,
          testUserPag.outputUserSaqqqrrrsss,
        ],
      });
    });
  });
}
