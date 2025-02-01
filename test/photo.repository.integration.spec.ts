import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { PhotoRepository } from '../src/infrastructure/repositories/photo.repository';
import { CustomHttpService } from '../src/infrastructure/services/http.service';
import { Photo } from '../src/core/domain/photo.entity';

jest.setTimeout(30000);

describe('PhotoRepository Integration', () => {
  let photoRepository: PhotoRepository;

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

  it('should return a valid photo for id=1', async () => {
    const photo: Photo = await photoRepository.getById(1);
    expect(photo).toBeDefined();
    expect(photo.id).toBe(1);
    expect(photo.title).toBeDefined();
    expect(photo.url).toBeDefined();
    expect(photo.thumbnailUrl).toBeDefined();
    expect(photo.albumId).toBeDefined();
  });

  it('should return an array of photos using getAll()', async () => {
    const photos: Photo[] = await photoRepository.getAll();
    expect(Array.isArray(photos)).toBe(true);
    expect(photos.length).toBeGreaterThan(0);
    const firstPhoto = photos[0];
    expect(firstPhoto).toHaveProperty('id');
    expect(firstPhoto).toHaveProperty('title');
    expect(firstPhoto).toHaveProperty('url');
    expect(firstPhoto).toHaveProperty('thumbnailUrl');
    expect(firstPhoto).toHaveProperty('albumId');
  });
});
