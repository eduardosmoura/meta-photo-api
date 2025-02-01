import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { MetaPhotoApiModule } from '../src/application/modules/meta-photo-api.module';

describe('MetaPhotoApi Module (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [MetaPhotoApiModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/health', () => {
    return request(app.getHttpServer()).get('/health').expect(200);
  });
});
