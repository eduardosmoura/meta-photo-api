import { IRepository } from 'src/common/interfaces/repository.interface';
import { Photo } from '../domain/photo.entity';

export interface IPhotoRepository extends IRepository<Photo> {
  getById(id: number): Promise<Photo>;
  getAll(): Promise<Photo[]>;
}
