import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PhotoRepository } from '../src/infrastructure/repositories/photo.repository';
import { CustomHttpService } from '../src/infrastructure/services/http.service';
import { Photo } from '../src/core/domain/photo.entity';

jest.setTimeout(30000);

describe('PhotoRepository Integration', () => {
  let photoRepository: PhotoRepository;
  let fetchedPhoto: Photo;
  let allPhotos: Photo[];

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        HttpModule,
        ConfigModule.forRoot({
          isGlobal: true,
          load: [
            () => ({
              EXTERNAL_API_BASE_URL: 'https://jsonplaceholder.typicode.com',
            }),
          ],
        }),
      ],
      providers: [PhotoRepository, CustomHttpService],
    }).compile();

    photoRepository = module.get<PhotoRepository>(PhotoRepository);
  });

  describe('When calling getById with id = 1', () => {
    beforeAll(async () => {
      fetchedPhoto = await photoRepository.getById(1);
    });

    it('should return a defined photo', () => {
      expect(fetchedPhoto).toBeDefined();
    });

    it('should return a photo with id equal to 1', () => {
      expect(fetchedPhoto.id).toBe(1);
    });

    it('should return a photo that has a defined title', () => {
      expect(fetchedPhoto.title).toBeDefined();
    });

    it('should return a photo that has a defined url', () => {
      expect(fetchedPhoto.url).toBeDefined();
    });

    it('should return a photo that has a defined thumbnailUrl', () => {
      expect(fetchedPhoto.thumbnailUrl).toBeDefined();
    });

    it('should return a photo that has a defined albumId', () => {
      expect(fetchedPhoto.albumId).toBeDefined();
    });
  });

  describe('When calling getAll', () => {
    beforeAll(async () => {
      allPhotos = await photoRepository.getAll();
    });

    it('should return an array of photos', () => {
      expect(Array.isArray(allPhotos)).toBe(true);
    });

    it('should return an array that is not empty', () => {
      expect(allPhotos.length).toBeGreaterThan(0);
    });

    describe('for the first photo in the returned array', () => {
      let firstPhoto: Photo;

      beforeAll(() => {
        firstPhoto = allPhotos[0];
      });

      it('should have an id property', () => {
        expect(firstPhoto).toHaveProperty('id');
      });

      it('should have a title property', () => {
        expect(firstPhoto).toHaveProperty('title');
      });

      it('should have a url property', () => {
        expect(firstPhoto).toHaveProperty('url');
      });

      it('should have a thumbnailUrl property', () => {
        expect(firstPhoto).toHaveProperty('thumbnailUrl');
      });

      it('should have an albumId property', () => {
        expect(firstPhoto).toHaveProperty('albumId');
      });
    });
  });
});
