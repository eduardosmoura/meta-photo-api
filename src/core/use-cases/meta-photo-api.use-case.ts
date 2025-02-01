import { Injectable } from '@nestjs/common';
import { Photo } from '../domain/photo.entity';
import {
  MetaPhotoApiService,
  PhotoFilters,
} from '../services/meta-photo-api.service';

@Injectable()
export class MetaPhotoApiUseCase {
  constructor(private readonly metaPhotoApiService: MetaPhotoApiService) {}

  async getEnrichedPhotoById(photoId: number): Promise<Photo> {
    return this.metaPhotoApiService.getEnrichedPhotoById(photoId);
  }

  async getEnrichedPhotos(filters: PhotoFilters): Promise<Photo[]> {
    return this.metaPhotoApiService.getEnrichedPhotos(filters);
  }
}
