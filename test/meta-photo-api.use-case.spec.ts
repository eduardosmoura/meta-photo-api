import { Test, TestingModule } from '@nestjs/testing';
import { MetaPhotoApiUseCase } from '../src/core/use-cases/meta-photo-api.use-case';
import { MetaPhotoApiService } from '../src/core/services/meta-photo-api.service';
import { NotFoundException } from '@nestjs/common';

describe('MetaPhotoApiUseCase', () => {
  let metaPhotoUseCase: MetaPhotoApiUseCase;
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
      },
    },
  };

  const metaPhotoServiceMock = {
    getEnrichedPhotoById: jest.fn().mockResolvedValue(samplePhoto),
    getEnrichedPhotos: jest.fn().mockResolvedValue([samplePhoto]),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaPhotoApiUseCase,
        { provide: MetaPhotoApiService, useValue: metaPhotoServiceMock },
      ],
    }).compile();

    metaPhotoUseCase = module.get<MetaPhotoApiUseCase>(MetaPhotoApiUseCase);
  });

  it('should return an enriched photo when getEnrichedPhotoById is called', async () => {
    const photo = await metaPhotoUseCase.getEnrichedPhotoById(1);
    expect(photo).toEqual(samplePhoto);
    expect(metaPhotoServiceMock.getEnrichedPhotoById).toHaveBeenCalledWith(1);
  });

  it('should throw a NotFoundException when the service rejects', async () => {
    metaPhotoServiceMock.getEnrichedPhotoById.mockRejectedValueOnce(
      new NotFoundException('Photo not found'),
    );
    await expect(metaPhotoUseCase.getEnrichedPhotoById(999)).rejects.toThrow(
      NotFoundException,
    );
  });

  it('should return an array of enriched photos when getEnrichedPhotos is called', async () => {
    const photos = await metaPhotoUseCase.getEnrichedPhotos({
      title: 'sample',
    });
    expect(photos).toEqual([samplePhoto]);
    expect(metaPhotoServiceMock.getEnrichedPhotos).toHaveBeenCalled();
  });
});
