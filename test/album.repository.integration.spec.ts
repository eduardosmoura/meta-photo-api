import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AlbumRepository } from '../src/infrastructure/repositories/album.repository';
import { CustomHttpService } from '../src/infrastructure/services/http.service';
import { Album } from '../src/core/domain/album.entity';

jest.setTimeout(30000);

describe('AlbumRepository Integration', () => {
  let albumRepository: AlbumRepository;
  let album: Album;

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
      providers: [AlbumRepository, CustomHttpService],
    }).compile();

    albumRepository = module.get<AlbumRepository>(AlbumRepository);
    album = await albumRepository.getById(1);
  });

  it('should return a defined album when fetching album with id 1', () => {
    expect(album).toBeDefined();
  });

  it('should return an album whose id is 1', () => {
    expect(album.id).toBe(1);
  });

  it('should return an album with a defined title', () => {
    expect(album.title).toBeDefined();
  });

  it('should return an album with a defined userId', () => {
    expect(album.userId).toBeDefined();
  });
});
