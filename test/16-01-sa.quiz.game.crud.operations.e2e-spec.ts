import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { delayFunction, endpoints } from './helpers/routing';
import { testQuestions } from './helpers/inputAndOutputObjects/questionObjects';
import { testComments } from './helpers/inputAndOutputObjects/commentObjects';
import { testAnswerBody } from './helpers/inputAndOutputObjects/answersObjects';
import { enumStatusGameType } from '../src/quizGame/quiz.game.types';
import { addAppSettings } from '../src/helpers/settings';
import { testGames } from './helpers/inputAndOutputObjects/gamesObjects';

export function quizGameCrudOperationsSa1601() {
  describe('---------- quizGame CRUD operation SA (e2e) -------------', () => {
    let app: INestApplication;

    const basicAuthRight = Buffer.from('admin:qwerty').toString('base64');
    let questionId1;
    let questionId2;
    let questionId3;
    let questionId4;
    let questionId5;
    let questionId6;
    let questionId7;
    let userId1;
    let userId2;
    let userId3;
    let accessTokenUser1;
    let accessTokenUser2;
    let accessTokenUser3;
    let gameId1;

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

    it('00-00 quiz/questions/:questionId/publish PUT = 204 publish question1', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId1}/publish`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({ published: true })
        .expect(204);

      if (createResponse.status === 204) {
        testQuestions.outputQuestion1Sa.published = true;
        testQuestions.outputQuestion1Sa.updatedAt = expect.any(String)
      }
    });

    it('00-00 quiz/questions POST = 201 create question2 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion2)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId2 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion2Sa);
    });

    it('00-00 quiz/questions/:questionId/publish PUT = 204 publish question2', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId2}/publish`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({ published: true })
        .expect(204);

      if (createResponse.status === 204) {
        testQuestions.outputQuestion2Sa.published = true;
        testQuestions.outputQuestion2Sa.updatedAt = expect.any(String)
      }
    });

    it('00-00 quiz/questions POST = 201 create question3 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion3)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId3 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion3Sa);
    });

    it('00-00 quiz/questions/:questionId/publish PUT = 204 publish question3', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId3}/publish`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({ published: true })
        .expect(204);

      if (createResponse.status === 204) {
        testQuestions.outputQuestion3Sa.published = true;
        testQuestions.outputQuestion3Sa.updatedAt = expect.any(String)
      }
    });

    it('00-00 quiz/questions POST = 201 create question4 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion4)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId4 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion4Sa);
    });

    it('00-00 quiz/questions/:questionId/publish PUT = 204 publish question4', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId4}/publish`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({ published: true })
        .expect(204);

      if (createResponse.status === 204) {
        testQuestions.outputQuestion4Sa.published = true;
        testQuestions.outputQuestion4Sa.updatedAt = expect.any(String)
      }
    });

    it('00-00 quiz/questions POST = 201 create question5 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion5)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId5 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion5Sa);
    });

    it('00-00 quiz/questions/:questionId/publish PUT = 204 publish question5', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId5}/publish`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({ published: true })
        .expect(204);

      if (createResponse.status === 204) {
        testQuestions.outputQuestion5Sa.published = true;
        testQuestions.outputQuestion5Sa.updatedAt = expect.any(String)
      }
    });

    it('00-00 quiz/questions POST = 201 create question6 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion6)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId6 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion6Sa);
    });

    it('00-00 quiz/questions/:questionId/publish PUT = 204 publish question6', async () => {
      const createResponse = await request(app.getHttpServer())
        .put(`${endpoints.quizQuestions}/${questionId6}/publish`)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send({ published: true })
        .expect(204);

      if (createResponse.status === 204) {
        testQuestions.outputQuestion6Sa.published = true;
        testQuestions.outputQuestion6Sa.updatedAt = expect.any(String)
      }
    });

    it('00-00 quiz/questions POST = 201 create question7 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.quizQuestions)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testQuestions.inputQuestion7)
        .expect(201);

      const createdResponseBody = createResponse.body;
      questionId7 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testQuestions.outputQuestion7Sa);
    });

    it('01-01 quiz/questions GET = 200 return array with 6 questions pagination', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(endpoints.quizQuestions)
        .query({ publishedStatus: 'published' })
        .set('Authorization', `Basic ${basicAuthRight}`)
        .expect(200);
      const createdResponse = createResponse.body;

      expect(createdResponse).toEqual({
        pagesCount: 1,
        page: 1,
        pageSize: 10,
        totalCount: 6,
        items: [
          testQuestions.outputQuestion6Sa,
          testQuestions.outputQuestion5Sa,
          testQuestions.outputQuestion4Sa,
          testQuestions.outputQuestion3Sa,
          testQuestions.outputQuestion2Sa,
          testQuestions.outputQuestion1Sa,
        ],
      });
    });

    it('00-00 sa/users post = 201 create user1 with return', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(endpoints.saUsers)
        .set('Authorization', `Basic ${basicAuthRight}`)
        .send(testComments.inputUser1)
        .expect(201);

      const createdResponseBody = createResponse.body;
      userId1 = createdResponseBody.id;

      expect(createdResponseBody).toEqual(testComments.outputUser1Sa);
    });

    it('00-00 login = 204 login user1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.auth}/login`)
        .send(testComments.loginUser1)
        .expect(200);
      const createdResponse = createResponse.body;
      accessTokenUser1 = createdResponse.accessToken;
      expect(createdResponse).toEqual({
        accessToken: expect.any(String),
      });
      expect(createResponse.headers['set-cookie']).toBeDefined();
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

    it('00-00 pair-game-quiz/pairs/connection POST = user1 create new game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/connection`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);

        const createdResponseBody = createResponse.body;
        gameId1 = createdResponseBody.id
        expect(createdResponseBody).toEqual(testGames.outputPandingGame);
        testGames.outputActiveGame.id = gameId1
        testGames.outputGameForDynamicChanges.firstPlayerProgress.player.id = userId1

    });

    it('00-00 pair-game-quiz/pairs/connection POST = user1 get 403 if trying create new game before finish previous', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/connection`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(403);
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user1 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputPandingGame);
        expect(createdResponseBody.firstPlayerProgress.player.id).toEqual(userId1)
    });

    it('00-00 pair-game-quiz/pairs/connection POST = user2 join to game1', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/connection`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputActiveGame);

        testGames.outputGameForDynamicChanges.secondPlayerProgress.player.id = userId2
        testGames.outputGameForDynamicChanges.status = enumStatusGameType.Active
        testGames.outputGameForDynamicChanges.startGameDate = expect.any(String)
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user1 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user2 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pair-game-quiz/pairs/my-current POST = user2 get 403 if trying connect to new game before finish previous', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/connection`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(403);
    });

    it('00-00 pairs/my-current/answers POST = user1 add correctAnswer 1 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
        testGames.outputGameForDynamicChanges.firstPlayerProgress.score ++
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user1 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pairs/my-current/answers POST = user1 add incorrectAnswer 2 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.incorrectAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.incorrectAnswerOutput);
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user2 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pairs/my-current/answers POST = user2 add correctAnswer 1 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.correctAnswerOutput);
      testGames.outputGameForDynamicChanges.secondPlayerProgress.score ++
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user2 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pairs/my-current/answers POST = user1 add correctAnswer 3 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.correctAnswerOutput);
      testGames.outputGameForDynamicChanges.firstPlayerProgress.score ++
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user1 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pairs/my-current/answers POST = user2 add correctAnswer 2 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.correctAnswerOutput);
      testGames.outputGameForDynamicChanges.secondPlayerProgress.score ++
    });

    it('00-00 pair-game-quiz/pairs/my-current GET = user2 req own game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/my-current`)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);
        const createdResponseBody = createResponse.body;
        expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
    });

    it('00-00 pairs/my-current/answers POST = user1 add correctAnswer 4 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.correctAnswerOutput);
      testGames.outputGameForDynamicChanges.firstPlayerProgress.score ++
    });

    it('00-00 pairs/my-current/answers POST = user2 add incorrectAnswer 3 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.incorrectAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.incorrectAnswerOutput);
    });

    it('00-00 pairs/my-current/answers POST = user2 add incorrectAnswer 4 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.incorrectAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.incorrectAnswerOutput);
    });

    it('00-00 pairs/my-current/answers POST = user1 add correctAnswer 5 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.correctAnswerOutput);
      testGames.outputGameForDynamicChanges.firstPlayerProgress.score ++
      testGames.outputGameForDynamicChanges.firstPlayerProgress.score ++

      
    });

    it('00-00 pairs/my-current/answers POST = 403 if user1 answered all questions', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.correctAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(403);
    });

    it('00-00 pairs/my-current/answers POST = user2 add incorrectAnswer 5 in game', async () => {
      const createResponse = await request(app.getHttpServer())
        .post(`${endpoints.pairGameQuiz}/pairs/my-current/answers`)
        .send(testAnswerBody.incorrectAnswerInput)
        .set('Authorization', `Bearer ${accessTokenUser2}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testAnswerBody.incorrectAnswerOutput);
      testGames.outputGameForDynamicChanges.status = enumStatusGameType.Finished
      testGames.outputGameForDynamicChanges.finishGameDate = expect.any(String)
    });

    it('00-00 pairs/:gameId GET = user1 req finished game', async () => {
      const createResponse = await request(app.getHttpServer())
        .get(`${endpoints.pairGameQuiz}/pairs/${gameId1}`)
        .set('Authorization', `Bearer ${accessTokenUser1}`)
        .expect(200);

      const createdResponseBody = createResponse.body;
      expect(createdResponseBody).toEqual(testGames.outputFinishedGame);
      expect(createdResponseBody).toEqual(testGames.outputGameForDynamicChanges);
      console.log(testGames.outputGameForDynamicChanges)
    });

 
  });
}
