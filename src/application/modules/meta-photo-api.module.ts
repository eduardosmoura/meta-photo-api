import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { ExternalPhotoController } from '../../infrastructure/controllers/external-photo.controller';
import { HealthCheckController } from '../../infrastructure/controllers/health-check.controller';
import { MetaPhotoApiService } from '../../core/services/meta-photo-api.service';
import { MetaPhotoApiUseCase } from '../../core/use-cases/meta-photo-api.use-case';
import { PhotoRepository } from '../../infrastructure/repositories/photo.repository';
import { AlbumRepository } from '../../infrastructure/repositories/album.repository';
import { UserRepository } from '../../infrastructure/repositories/user.repository';
import { CustomHttpService } from '../../infrastructure/services/http.service';
import * as path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: (() => {
        // Determine the correct .env file based on NODE_ENV
        const env = process.env.NODE_ENV || 'development';
        return path.resolve(process.cwd(), `.env.${env}`);
      })(),
    }),
    HttpModule,
  ],
  controllers: [ExternalPhotoController, HealthCheckController],
  providers: [
    MetaPhotoApiService,
    MetaPhotoApiUseCase,
    { provide: 'IPhotoRepository', useClass: PhotoRepository },
    { provide: 'IAlbumRepository', useClass: AlbumRepository },
    { provide: 'IUserRepository', useClass: UserRepository },
    CustomHttpService,
  ],
})
export class MetaPhotoApiModule {}
