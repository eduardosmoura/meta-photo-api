import { Test, TestingModule } from '@nestjs/testing';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '@nestjs/config';
import { UserRepository } from '../src/infrastructure/repositories/user.repository';
import { CustomHttpService } from '../src/infrastructure/services/http.service';
import { User } from '../src/core/domain/user.entity';

jest.setTimeout(30000); // Increase timeout if needed

describe('UserRepository Integration', () => {
  let userRepository: UserRepository;

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

  it('should return a valid user for id=1', async () => {
    const user: User = await userRepository.getById(1);
    expect(user).toBeDefined();
    expect(user.id).toBe(1);
    expect(user.name).toBeDefined();
    expect(user.username).toBeDefined();
    expect(user.email).toBeDefined();
    // Additional properties can be verified as needed
    expect(user.address).toBeDefined();
    expect(user.address.street).toBeDefined();
    expect(user.company).toBeDefined();
  });
});
