import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { Users } from '../entities/users.entity';
import { CreateUserInput } from '../dto/create-user.input';

describe('UsersService', () => {
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
        UsersService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<Users>>(getRepositoryToken(Users));
  });

  describe('findAll', () => {
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
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      const result = await service.findAll();

      expect(result).toEqual(users);
      expect(repository.find).toHaveBeenCalledWith({
        relations: ['playlists'],
      });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user: Users = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: '1234',
        playlists: [],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findOne(1);

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('findUserByEmailPassword', () => {
    it('should return a user by email and password', async () => {
      const user: Users = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        playlists: [],
      };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      const result = await service.findUserByEmailPassword(
        'john.doe@example.com',
        'password',
      );

      expect(result).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { email: 'john.doe@example.com', password: 'password' },
      });
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const user: CreateUserInput = {
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
      };
      const newUser: Users = {
        id: 1,
        name: 'John Doe',
        email: 'john.doe@example.com',
        password: 'password',
        playlists: [],
      };
      jest.spyOn(repository, 'create').mockReturnValue(newUser);
      jest.spyOn(repository, 'save').mockResolvedValue(newUser);

      const result = await service.createUser(user);

      expect(result).toEqual(newUser);
      expect(repository.create).toHaveBeenCalledWith(user);
      expect(repository.save).toHaveBeenCalledWith(newUser);
    });
  });
});
