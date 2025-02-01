import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { AlbumRepository } from '../src/infrastructure/repositories/album.repository';
import { CustomHttpService } from '../src/infrastructure/services/http.service';
import { Album } from '../src/core/domain/album.entity';

jest.setTimeout(30000);

describe('AlbumRepository Integration', () => {
  let albumRepository: AlbumRepository;

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
  });

  it('should return a valid album for id=1', async () => {
    const album: Album = await albumRepository.getById(1);
    expect(album).toBeDefined();
    expect(album.id).toBe(1);
    expect(album.title).toBeDefined();
    expect(album.userId).toBeDefined();
  });
});
