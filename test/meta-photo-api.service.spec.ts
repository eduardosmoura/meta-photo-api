import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { MetaPhotoApiService } from '../src/core/services/meta-photo-api.service';

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

  const samplePhoto = {
    id: 1,
    title: 'Sample Photo',
    albumId: 1,
  };
  const sampleAlbum = {
    id: 1,
    title: 'Sample Album',
    userId: 1,
  };
  const sampleUser = {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
  };

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

  it('should return an enriched photo by id', async () => {
    mockPhotoRepo.getById.mockResolvedValue(samplePhoto);
    mockAlbumRepo.getById.mockResolvedValue(sampleAlbum);
    mockUserRepo.getById.mockResolvedValue(sampleUser);

    const enrichedPhoto = await service.getEnrichedPhotoById(1);
    expect(enrichedPhoto).toEqual({
      ...samplePhoto,
      album: { ...sampleAlbum, user: sampleUser },
    });
  });

  it('should throw NotFoundException if photo is not found', async () => {
    mockPhotoRepo.getById.mockResolvedValue(null);
    await expect(service.getEnrichedPhotoById(999)).rejects.toThrow(
      NotFoundException,
    );
  });
});
