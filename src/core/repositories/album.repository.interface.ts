import { IRepository } from 'src/common/interfaces/repository.interface';
import { Album } from '../domain/album.entity';

export interface IAlbumRepository extends IRepository<Album> {
  getById(id: number): Promise<Album>;
}
