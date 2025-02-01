import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IAlbumRepository } from '../../core/repositories/album.repository.interface';
import { Album } from '../../core/domain/album.entity';
import { CustomHttpService } from '../services/http.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AlbumRepository implements IAlbumRepository {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: CustomHttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = `${this.configService.get<string>('EXTERNAL_API_BASE_URL')}/albums`;
  }

  async getById(id: number): Promise<Album> {
    const url = `${this.baseUrl}/${id}`;
    try {
      return await this.httpService.get<Album>(url);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch album data',
        error,
      );
    }
  }
}
