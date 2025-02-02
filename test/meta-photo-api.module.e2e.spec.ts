import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MetaPhotoApiModule } from '../src/application/modules/meta-photo-api.module';

describe('MetaPhotoApi Module (e2e)', () => {
  let app: INestApplication;
  let healthResponse: request.Response;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MetaPhotoApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    healthResponse = await request(app.getHttpServer()).get('/health');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When GET /health is called', () => {
    it('should return a status code of 200', () => {
      expect(healthResponse.status).toBe(200);
    });

    it('should return a response body that is defined', () => {
      expect(healthResponse.body).toBeDefined();
    });

    it('should return a health status property', () => {
      expect(healthResponse.body.status).toBeDefined();
    });

    it('should indicate that the API is healthy by having a status value of "ok"', () => {
      expect(healthResponse.body.status).toBe('ok');
    });
  });
});
