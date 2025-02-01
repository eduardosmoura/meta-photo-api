import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { IPhotoRepository } from '../../core/repositories/photo.repository.interface';
import { IAlbumRepository } from '../../core/repositories/album.repository.interface';
import { IUserRepository } from '../../core/repositories/user.repository.interface';
import { Photo } from '../../core/domain/photo.entity';
import logger from '../../common/utils/logger';

export interface PhotoFilters {
  title?: string;
  'album.title'?: string;
  'album.user.email'?: string;
  limit?: number;
  offset?: number;
}

@Injectable()
export class MetaPhotoApiService {
  constructor(
    @Inject('IPhotoRepository')
    private readonly photoRepo: IPhotoRepository,
    @Inject('IAlbumRepository')
    private readonly albumRepo: IAlbumRepository,
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
  ) {}

  async getEnrichedPhotoById(photoId: number): Promise<Photo> {
    const photo = await this.photoRepo.getById(photoId);
    if (!photo) {
      throw new NotFoundException(`Photo with id ${photoId} not found`);
    }
    const album = await this.albumRepo.getById(photo.albumId);
    if (!album) {
      throw new NotFoundException(`Album with id ${photo.albumId} not found`);
    }
    const user = await this.userRepo.getById(album.userId);
    if (!user) {
      throw new NotFoundException(`User with id ${album.userId} not found`);
    }

    album.user = user;
    photo.album = album;
    return photo;
  }

  async getEnrichedPhotos(filters: PhotoFilters): Promise<Photo[]> {
    const allPhotos = await this.photoRepo.getAll();

    // Cache albums and users to avoid repeated calls
    const albumMap = new Map<number, any>();
    for (const photo of allPhotos) {
      if (!albumMap.has(photo.albumId)) {
        const album = await this.albumRepo.getById(photo.albumId);
        if (album) {
          const user = await this.userRepo.getById(album.userId);
          album.user = user;
          albumMap.set(photo.albumId, album);
        }
      }
      photo.album = albumMap.get(photo.albumId);
    }

    let enrichedPhotos = allPhotos;
    if (filters.title) {
      enrichedPhotos = enrichedPhotos.filter((photo) =>
        photo.title.toLowerCase().includes(filters.title.toLowerCase()),
      );
    }
    if (filters['album.title']) {
      enrichedPhotos = enrichedPhotos.filter(
        (photo) =>
          photo.album &&
          photo.album.title
            .toLowerCase()
            .includes(filters['album.title'].toLowerCase()),
      );
    }
    if (filters['album.user.email']) {
      enrichedPhotos = enrichedPhotos.filter(
        (photo) =>
          photo.album &&
          photo.album.user &&
          photo.album.user.email.toLowerCase() ===
            filters['album.user.email'].toLowerCase(),
      );
    }

    const limit = Number(filters.limit) || 25;
    const offset = Number(filters.offset) || 0;

    logger.debug(`limit ${limit} | offset ${offset}`);

    logger.debug(`enrichedPhotos ${enrichedPhotos.length}`);

    const paginatedPhotos = enrichedPhotos.slice(offset, offset + limit);

    logger.debug(`paginatedPhotos ${paginatedPhotos.length}`);

    return paginatedPhotos;
  }
}
