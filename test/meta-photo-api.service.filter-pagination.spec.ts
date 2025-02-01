import { Test, TestingModule } from '@nestjs/testing';
import { MetaPhotoApiService } from '../src/core/services/meta-photo-api.service';

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

describe('MetaPhotoService - Filtering and Pagination', () => {
  let service: MetaPhotoApiService;

  // Sample data for testing
  const samplePhotos = [
    { id: 1, title: 'Amazing Sunset', albumId: 10 },
    { id: 2, title: 'Sunset over the Hills', albumId: 10 },
    { id: 3, title: 'Ocean View', albumId: 20 },
    { id: 4, title: 'Mountain View', albumId: 20 },
    { id: 5, title: 'City Lights', albumId: 30 },
    { id: 6, title: 'Night Skyline', albumId: 30 },
    { id: 7, title: 'Forest Trail', albumId: 40 },
    { id: 8, title: 'Desert Dunes', albumId: 40 },
    { id: 9, title: 'River Bend', albumId: 50 },
    { id: 10, title: 'Snowy Peaks', albumId: 50 },
    { id: 11, title: 'Golden Hour', albumId: 60 },
    { id: 12, title: 'City Sunrise', albumId: 60 },
  ];

  // Albums for corresponding albumIds
  const sampleAlbums = {
    10: { id: 10, title: 'Nature Album', userId: 100 },
    20: { id: 20, title: 'Vacation Album', userId: 200 },
    30: { id: 30, title: 'Urban Album', userId: 300 },
    40: { id: 40, title: 'Wildlife Album', userId: 400 },
    50: { id: 50, title: 'Travel Album', userId: 500 },
    60: { id: 60, title: 'Sunrise Album', userId: 600 },
  };

  // Users for corresponding userIds
  const sampleUsers = {
    100: { id: 100, name: 'Alice', email: 'alice@example.com' },
    200: { id: 200, name: 'Bob', email: 'bob@example.com' },
    300: { id: 300, name: 'Charlie', email: 'charlie@example.com' },
    400: { id: 400, name: 'Diana', email: 'diana@example.com' },
    500: { id: 500, name: 'Evan', email: 'evan@example.com' },
    600: { id: 600, name: 'Fiona', email: 'fiona@example.com' },
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

    // Reset and set up default mocks
    mockPhotoRepo.getAll.mockReset();
    mockAlbumRepo.getById.mockReset();
    mockUserRepo.getById.mockReset();

    // The photo repository returns our sample photos
    mockPhotoRepo.getAll.mockResolvedValue(samplePhotos);

    // The album repository returns the corresponding album based on albumId
    mockAlbumRepo.getById.mockImplementation((albumId: number) =>
      Promise.resolve(sampleAlbums[albumId]),
    );

    // The user repository returns the corresponding user based on userId
    mockUserRepo.getById.mockImplementation((userId: number) =>
      Promise.resolve(sampleUsers[userId]),
    );
  });

  it('should filter photos by photo title (case-insensitive)', async () => {
    const filters = { title: 'sunset' };
    const results = await service.getEnrichedPhotos(filters);
    // Expect photos with id 1 and 2 because their titles contain "sunset" (ignoring case)
    expect(results.map((p) => p.id).sort()).toEqual([1, 2]);
  });

  it('should filter photos by album title (case-insensitive)', async () => {
    const filters = { 'album.title': 'vacation' };
    const results = await service.getEnrichedPhotos(filters);
    // Expect photos from albumId 20 ("Vacation Album") – photos with id 3 and 4
    expect(results.map((p) => p.id).sort()).toEqual([3, 4]);
  });

  it('should filter photos by album user email (case-insensitive)', async () => {
    const filters = { 'album.user.email': 'charlie@example.com' };
    const results = await service.getEnrichedPhotos(filters);
    // Expect photos from albumId 30 ("Urban Album") – photos with id 5 and 6
    expect(results.map((p) => p.id).sort()).toEqual([5, 6]);
  });

  it('should combine filters for photo title and album title', async () => {
    const filters = { title: 'view', 'album.title': 'vacation' };
    const results = await service.getEnrichedPhotos(filters);
    // "View" is in both "Ocean View" and "Mountain View" from albumId 20
    expect(results.map((p) => p.id).sort()).toEqual([3, 4]);
  });

  it('should return exactly the number of items specified by the limit', async () => {
    const filters = { limit: 8, offset: 2 };
    const results = await service.getEnrichedPhotos(filters);
    expect(results.length).toEqual(8);
  });

  it('should return exactly the number of items specified by the limit if enough items exist', async () => {
    // No filtering here so all samplePhotos are returned first, then paginated.
    const filters = { limit: 5, offset: 0 };
    const results = await service.getEnrichedPhotos(filters);
    expect(results.length).toEqual(5);
    // Check that the returned items are the first 5 items in the samplePhotos order
    expect(results.map((p) => p.id)).toEqual([1, 2, 3, 4, 5]);
  });

  it('should return an empty array if offset exceeds the total number of items', async () => {
    const filters = { limit: 5, offset: 1000 }; // Offset is way beyond available items
    const results = await service.getEnrichedPhotos(filters);
    expect(results).toEqual([]);
  });

  it('should return remaining items if offset + limit exceeds the array length', async () => {
    // For samplePhotos length of 12, if offset is 10 and limit is 5, then only 2 items should be returned.
    const filters = { limit: 5, offset: 10 };
    const results = await service.getEnrichedPhotos(filters);
    expect(results.length).toEqual(2);
    // Expect the last two items (id 11 and id 12)
    expect(results.map((p) => p.id)).toEqual([11, 12]);
  });
});
