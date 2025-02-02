import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MetaPhotoApiService } from '../src/core/services/meta-photo-api.service';
import {
  samplePhoto,
  sampleAlbum,
  sampleUser,
} from './fixtures/enriched-photo-data';

const mockPhotoRepo = {
  getById: jest.fn(),
  getAll: jest.fn(),
};

const mockAlbumRepo = {
  getById: jest.fn(),
};

const mockUserRepo = {
  getById: jest.fn(),
};

describe('MetaPhotoApiService', () => {
  let service: MetaPhotoApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MetaPhotoApiService,
        { provide: 'IPhotoRepository', useValue: mockPhotoRepo },
        { provide: 'IAlbumRepository', useValue: mockAlbumRepo },
        { provide: 'IUserRepository', useValue: mockUserRepo },
      ],
    }).compile();

    service = module.get<MetaPhotoApiService>(MetaPhotoApiService);

    mockPhotoRepo.getById.mockReset();
    mockAlbumRepo.getById.mockReset();
    mockUserRepo.getById.mockReset();
  });

  describe('Enriching a photo by id', () => {
    describe('when the photo exists in the repository', () => {
      beforeEach(() => {
        mockPhotoRepo.getById.mockResolvedValue(samplePhoto);
        mockAlbumRepo.getById.mockResolvedValue(sampleAlbum);
        mockUserRepo.getById.mockResolvedValue(sampleUser);
      });

      it('should return an enriched photo that is defined', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto).toBeDefined();
      });

      it('should return an enriched photo with the correct photo id', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto.id).toBe(samplePhoto.id);
      });

      it('should return an enriched photo with the correct photo title', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto.title).toBe(samplePhoto.title);
      });

      it('should return an enriched photo that includes album information', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto.album).toBeDefined();
      });

      it('should return an enriched photo whose album data matches the repository', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto.album.id).toBe(sampleAlbum.id);
      });

      it('should return an enriched photo that includes user information within the album', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto.album.user).toBeDefined();
      });

      it('should return an enriched photo whose user data matches the repository', async () => {
        const enrichedPhoto = await service.getEnrichedPhotoById(1);
        expect(enrichedPhoto.album.user.id).toBe(sampleUser.id);
      });
    });

    describe('when the photo does not exist in the repository', () => {
      beforeEach(() => {
        mockPhotoRepo.getById.mockResolvedValue(null);
      });

      it('should throw a NotFoundException when a non-existent photo is requested', async () => {
        await expect(service.getEnrichedPhotoById(999)).rejects.toThrow(
          NotFoundException,
        );
      });
    });
  });
});
