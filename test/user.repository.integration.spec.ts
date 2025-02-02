import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '../src/infrastructure/repositories/user.repository';
import { CustomHttpService } from '../src/infrastructure/services/http.service';
import { User } from '../src/core/domain/user.entity';

jest.setTimeout(30000);

describe('UserRepository Integration', () => {
  let userRepository: UserRepository;
  let fetchedUser: User;

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
      providers: [UserRepository, CustomHttpService],
    }).compile();

    userRepository = module.get<UserRepository>(UserRepository);
  });

  describe('When fetching a user by id = 1', () => {
    beforeAll(async () => {
      fetchedUser = await userRepository.getById(1);
    });

    it('should return a user that is defined', () => {
      expect(fetchedUser).toBeDefined();
    });

    it('should return a user with id equal to 1', () => {
      expect(fetchedUser.id).toBe(1);
    });

    it('should return a user with a defined name', () => {
      expect(fetchedUser.name).toBeDefined();
    });

    it('should return a user with a defined username', () => {
      expect(fetchedUser.username).toBeDefined();
    });

    it('should return a user with a defined email', () => {
      expect(fetchedUser.email).toBeDefined();
    });

    it('should return a user with an address defined', () => {
      expect(fetchedUser.address).toBeDefined();
    });

    it('should return a user with a street in the address defined', () => {
      expect(fetchedUser.address.street).toBeDefined();
    });

    it('should return a user with a company defined', () => {
      expect(fetchedUser.company).toBeDefined();
    });
  });
});
