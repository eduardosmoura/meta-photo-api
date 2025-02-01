import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { IUserRepository } from '../../core/repositories/user.repository.interface';
import { User } from '../../core/domain/user.entity';
import { CustomHttpService } from '../services/http.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UserRepository implements IUserRepository {
  private readonly baseUrl: string;

  constructor(
    private readonly httpService: CustomHttpService,
    private readonly configService: ConfigService,
  ) {
    this.baseUrl = `${this.configService.get<string>('EXTERNAL_API_BASE_URL')}/users`;
  }

  async getById(id: number): Promise<User> {
    const url = `${this.baseUrl}/${id}`;
    try {
      return await this.httpService.get<User>(url);
    } catch (error) {
      throw new InternalServerErrorException(
        'Failed to fetch user data',
        error,
      );
    }
  }
}
