import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IPhotoRepository } from '../../core/repositories/photo.repository.interface';
import { Photo } from '../../core/domain/photo.entity';
import { CustomHttpService } from '../services/http.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PhotoRepository implements IPhotoRepository {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: CustomHttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = `${this.configService.get<string>('EXTERNAL_API_BASE_URL')}/photos`;
  }

  async getById(id: number): Promise<Photo> {
    const url = `${this.baseUrl}/${id}`;
    try {
      return await this.httpService.get<Photo>(url);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch photo data',
        error,
      );
    }
  }

  async getAll(): Promise<Photo[]> {
    try {
      return await this.httpService.get<Photo[]>(this.baseUrl);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch photos data',
        error,
      );
    }
  }
}
