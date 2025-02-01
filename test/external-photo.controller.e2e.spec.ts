import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, HttpStatus } from '@nestjs/common';
import * as request from 'supertest';
import { ExternalPhotoController } from '../src/infrastructure/controllers/external-photo.controller';
import { MetaPhotoApiUseCase } from '../src/core/use-cases/meta-photo-api.use-case';

const samplePhoto = {
  id: 1,
  title: 'Sample Photo',
  url: 'http://example.com/photo.jpg',
  thumbnailUrl: 'http://example.com/thumb.jpg',
  album: {
    id: 1,
    title: 'Sample Album',
    user: {
      id: 1,
      name: 'John Doe',
      username: 'johndoe',
      email: 'john@example.com',
      address: {
        street: 'Main St',
        suite: 'Apt. 1',
        city: 'Anytown',
        zipcode: '12345',
        geo: { lat: '0.0', lng: '0.0' },
      },
      phone: '123-456-7890',
      website: 'example.com',
      company: {
        name: 'Example Inc.',
        catchPhrase: 'We deliver',
        bs: 'business stuff',
      },
    },
  },
};

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

  it('GET /externalapi/photos/:id should return an enriched photo', () => {
    return request(app.getHttpServer())
      .get('/externalapi/photos/1')
      .expect(HttpStatus.OK)
      .expect(samplePhoto);
  });

  it('GET /externalapi/photos should return an array of enriched photos', () => {
    return request(app.getHttpServer())
      .get('/externalapi/photos')
      .expect(HttpStatus.OK)
      .expect([samplePhoto]);
  });
});
