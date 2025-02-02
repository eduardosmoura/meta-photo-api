import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MetaPhotoApiUseCase } from '../src/core/use-cases/meta-photo-api.use-case';
import { MetaPhotoApiService } from '../src/core/services/meta-photo-api.service';
import { enrichedSamplePhoto } from './fixtures/enriched-photo-data';

const metaPhotoServiceMock = {
  getEnrichedPhotoById: jest.fn(),
  getEnrichedPhotos: jest.fn(),
};

describe('MetaPhotoApiUseCase', () => {
  let metaPhotoUseCase: MetaPhotoApiUseCase;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaPhotoApiUseCase,
        { provide: MetaPhotoApiService, useValue: metaPhotoServiceMock },
      ],
    }).compile();

    metaPhotoUseCase = module.get<MetaPhotoApiUseCase>(MetaPhotoApiUseCase);

    metaPhotoServiceMock.getEnrichedPhotoById.mockReset();
    metaPhotoServiceMock.getEnrichedPhotos.mockReset();
  });

  describe('Successful scenarios', () => {
    describe('when fetching an enriched photo by id and the photo exists', () => {
      beforeEach(() => {
        metaPhotoServiceMock.getEnrichedPhotoById.mockResolvedValue(
          enrichedSamplePhoto,
        );
      });

      it('should return a defined enriched photo', async () => {
        const photo = await metaPhotoUseCase.getEnrichedPhotoById(1);
        expect(photo).toBeDefined();
      });

      it('should return the enriched photo with the correct id', async () => {
        const photo = await metaPhotoUseCase.getEnrichedPhotoById(1);
        expect(photo.id).toEqual(enrichedSamplePhoto.id);
      });

      it('should return the enriched photo with the correct title', async () => {
        const photo = await metaPhotoUseCase.getEnrichedPhotoById(1);
        expect(photo.title).toEqual(enrichedSamplePhoto.title);
      });

      it('should call the underlying service with the provided id', async () => {
        await metaPhotoUseCase.getEnrichedPhotoById(1);
        expect(metaPhotoServiceMock.getEnrichedPhotoById).toHaveBeenCalledWith(
          1,
        );
      });
    });

    describe('when fetching an array of enriched photos', () => {
      beforeEach(() => {
        metaPhotoServiceMock.getEnrichedPhotos.mockResolvedValue([
          enrichedSamplePhoto,
        ]);
      });

      it('should return an array from the service', async () => {
        const photos = await metaPhotoUseCase.getEnrichedPhotos({
          title: 'sample',
        });
        expect(Array.isArray(photos)).toBe(true);
      });

      it('should return an array with exactly one enriched photo', async () => {
        const photos = await metaPhotoUseCase.getEnrichedPhotos({
          title: 'sample',
        });
        expect(photos.length).toEqual(1);
      });

      it('should return the enriched photo with the correct title in the array', async () => {
        const photos = await metaPhotoUseCase.getEnrichedPhotos({
          title: 'sample',
        });
        expect(photos[0].title).toEqual(enrichedSamplePhoto.title);
      });

      it('should call the underlying service method to get the enriched photos', async () => {
        await metaPhotoUseCase.getEnrichedPhotos({ title: 'sample' });
        expect(metaPhotoServiceMock.getEnrichedPhotos).toHaveBeenCalled();
      });
    });
  });

  describe('Failure scenarios', () => {
    describe('when fetching an enriched photo by id and the photo does not exist', () => {
      beforeEach(() => {
        metaPhotoServiceMock.getEnrichedPhotoById.mockRejectedValue(
          new NotFoundException('Photo not found'),
        );
      });

      it('should throw a NotFoundException for a non-existent photo', async () => {
        await expect(
          metaPhotoUseCase.getEnrichedPhotoById(999),
        ).rejects.toThrow(NotFoundException);
      });
    });
  });
});
