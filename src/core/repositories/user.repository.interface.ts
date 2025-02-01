import { IRepository } from 'src/common/interfaces/repository.interface';
import { User } from '../domain/user.entity';

export interface IUserRepository extends IRepository<User> {
  getById(id: number): Promise<User>;
}
