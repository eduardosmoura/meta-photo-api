import { Test, TestingModule } from '@nestjs/testing';
import { MetaPhotoApiService } from '../src/core/services/meta-photo-api.service';
import { samplePhotos, sampleAlbums, sampleUsers } from './fixtures/photo-Data';

jest.setTimeout(30000);

describe('MetaPhotoApiService - Filtering and Pagination', () => {
  let service: MetaPhotoApiService;

  const mockPhotoRepo = {
    getAll: jest.fn(),
    getById: jest.fn(),
  };
  const mockAlbumRepo = {
    getById: jest.fn(),
  };
  const mockUserRepo = {
    getById: jest.fn(),
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

    mockPhotoRepo.getAll.mockReset();
    mockAlbumRepo.getById.mockReset();
    mockUserRepo.getById.mockReset();

    mockPhotoRepo.getAll.mockResolvedValue(samplePhotos);

    mockAlbumRepo.getById.mockImplementation((albumId: number) =>
      Promise.resolve(sampleAlbums[albumId]),
    );

    mockUserRepo.getById.mockImplementation((userId: number) =>
      Promise.resolve(sampleUsers[userId]),
    );
  });

  describe('Filtering functionality', () => {
    describe('when filtering by photo title (case-insensitive)', () => {
      it('should return only the photos whose titles contain "sunset"', async () => {
        const filters = { title: 'sunset' };
        const results = await service.getEnrichedPhotos(filters);
        // Expect photos with id 1 and 2 because their titles contain "sunset"
        expect(results.map((p) => p.id).sort()).toEqual([1, 2]);
      });
    });

    describe('when filtering by album title (case-insensitive)', () => {
      it('should return only the photos that belong to an album with "vacation" in its title', async () => {
        const filters = { 'album.title': 'vacation' };
        const results = await service.getEnrichedPhotos(filters);
        // Expect photos with id 3 and 4 for albumId 20 ("Vacation Album")
        expect(results.map((p) => p.id).sort()).toEqual([3, 4]);
      });
    });

    describe('when filtering by album user email (case-insensitive)', () => {
      it('should return only the photos that belong to an album with a user email of "charlie@example.com"', async () => {
        const filters = { 'album.user.email': 'charlie@example.com' };
        const results = await service.getEnrichedPhotos(filters);
        // Expect photos with id 5 and 6 for albumId 30 ("Urban Album")
        expect(results.map((p) => p.id).sort()).toEqual([5, 6]);
      });
    });

    describe('when combining filters for photo title and album title', () => {
      it('should return only photos that match both filters', async () => {
        const filters = { title: 'view', 'album.title': 'vacation' };
        const results = await service.getEnrichedPhotos(filters);
        // "View" is in both "Ocean View" and "Mountain View" from albumId 20.
        expect(results.map((p) => p.id).sort()).toEqual([3, 4]);
      });
    });
  });

  describe('Pagination functionality', () => {
    describe('when applying a limit and offset that are within range', () => {
      it('should return exactly the number of photos specified by the limit', async () => {
        const filters = { limit: 5, offset: 0 };
        const results = await service.getEnrichedPhotos(filters);
        expect(results.length).toBe(5);
      });

      it('should return the first 5 photos when offset is 0', async () => {
        const filters = { limit: 5, offset: 0 };
        const results = await service.getEnrichedPhotos(filters);
        expect(results.map((p) => p.id)).toEqual([1, 2, 3, 4, 5]);
      });
    });

    describe('when the offset exceeds the total number of available photos', () => {
      it('should return an empty array', async () => {
        const filters = { limit: 5, offset: 1000 };
        const results = await service.getEnrichedPhotos(filters);
        expect(results).toEqual([]);
      });
    });

    describe('when offset plus limit exceeds the total number of photos', () => {
      it('should return only the remaining photos if less than the limit are available', async () => {
        const filters = { limit: 5, offset: 10 };
        const results = await service.getEnrichedPhotos(filters);
        expect(results.length).toBe(2);
      });

      it('should return the correct last two photo IDs', async () => {
        const filters = { limit: 5, offset: 10 };
        const results = await service.getEnrichedPhotos(filters);
        expect(results.map((p) => p.id)).toEqual([11, 12]);
      });
    });
  });
});
