import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersResolver } from './users.resolver';
import { UsersService } from '../services/users.service';
import { Users } from '../entities/users.entity';
import { CreateUserInput } from '../dto/create-user.input';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let service: UsersService;
  let repository: Repository<Users>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
      providers: [
        UsersResolver,
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('users', () => {
    it('should return an array of users', async () => {
      const users: Users[] = [
        {
          id: 1,
          name: 'John Doe',
          email: 'john.doe@example.com',
          password: '1234',
          playlists: [],
        },
        {
          id: 2,
          name: 'Jane Smith',
          email: 'jane.smith@example.com',
          password: '1234',
          playlists: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(users);

      const result = await resolver.users();

      expect(result).toEqual(users);
      expect(service.findAll).toHaveBeenCalled();
    });
  });

  describe('user', () => {
    it('should return a user by email and password', async () => {
      const user: Users = {
        id: 1,
        name: 'John Doe',
        email: 'test1@test.com',
        password: 'password1',
        playlists: [],
      };
      jest.spyOn(service, 'findUserByEmailPassword').mockResolvedValue(user);

      const result = await resolver.user('test1@test.com', 'password1');

      expect(result).toEqual(user);
      expect(service.findUserByEmailPassword).toHaveBeenCalledWith(
        'test1@test.com',
        'password1',
      );
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const userInput: CreateUserInput = {
        name: 'John Doe',
        email: 'test1@test.com',
        password: 'password1',
      };
      const user: Users = {
        id: 1,
        name: 'John Doe',
        email: 'test1@test.com',
        password: 'password1',
        playlists: [],
      };
      jest.spyOn(service, 'createUser').mockResolvedValue(user);

      const result = await resolver.createUser(userInput);

      expect(result).toEqual(user);
      expect(service.createUser).toHaveBeenCalledWith(userInput);
    });
  });
});
