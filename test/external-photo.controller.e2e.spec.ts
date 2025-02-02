import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ExternalPhotoController } from '../src/infrastructure/controllers/external-photo.controller';
import { MetaPhotoApiUseCase } from '../src/core/use-cases/meta-photo-api.use-case';
import { samplePhoto } from './fixtures/sample-photo';

jest.setTimeout(30000);

describe('ExternalPhotoController (e2e)', () => {
  let app: INestApplication;
  const metaPhotoUseCaseMock = {
    getEnrichedPhotoById: jest.fn().mockResolvedValue(samplePhoto),
    getEnrichedPhotos: jest.fn().mockResolvedValue([samplePhoto]),
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [ExternalPhotoController],
      providers: [
        {
          provide: MetaPhotoApiUseCase,
          useValue: metaPhotoUseCaseMock,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('When GET /externalapi/photos/:id is called', () => {
    let response: request.Response;

    beforeAll(async () => {
      response = await request(app.getHttpServer()).get(
        '/externalapi/photos/1',
      );
    });

    it('should return a status code of 200', () => {
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return a response body of type object', () => {
      expect(typeof response.body).toBe('object');
    });

    it('should return the correct photo id', () => {
      expect(response.body.id).toBe(samplePhoto.id);
    });

    it('should return the correct photo title', () => {
      expect(response.body.title).toBe(samplePhoto.title);
    });

    it('should return the correct photo URL', () => {
      expect(response.body.url).toBe(samplePhoto.url);
    });

    it('should return the correct thumbnail URL', () => {
      expect(response.body.thumbnailUrl).toBe(samplePhoto.thumbnailUrl);
    });

    it('should return the correct album object', () => {
      expect(response.body.album).toEqual(samplePhoto.album);
    });
  });

  describe('When GET /externalapi/photos is called', () => {
    let response: request.Response;

    beforeAll(async () => {
      response = await request(app.getHttpServer()).get('/externalapi/photos');
    });

    it('should return a status code of 200', () => {
      expect(response.status).toBe(HttpStatus.OK);
    });

    it('should return an array as the response body', () => {
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return an array with exactly one photo', () => {
      expect(response.body.length).toBe(1);
    });

    it('should return the correct photo id in the array', () => {
      expect(response.body[0].id).toBe(samplePhoto.id);
    });

    it('should return the correct photo title in the array', () => {
      expect(response.body[0].title).toBe(samplePhoto.title);
    });

    it('should return the correct photo URL in the array', () => {
      expect(response.body[0].url).toBe(samplePhoto.url);
    });

    it('should return the correct thumbnail URL in the array', () => {
      expect(response.body[0].thumbnailUrl).toBe(samplePhoto.thumbnailUrl);
    });

    it('should return the correct album object in the array', () => {
      expect(response.body[0].album).toEqual(samplePhoto.album);
    });
  });
});
