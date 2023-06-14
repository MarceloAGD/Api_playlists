import { Test, TestingModule } from '@nestjs/testing';
import { ActorsService } from './actors.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Actor } from '../entities/actor.entity';
import { Repository } from 'typeorm';
import { CreateActorInput } from '../dto/create-actor.input';

describe('ActorsService', () => {
  let service: ActorsService;
  let repository: Repository<Actor>;

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
        ActorsService,
        {
          provide: getRepositoryToken(Actor),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ActorsService>(ActorsService);
    repository = module.get<Repository<Actor>>(getRepositoryToken(Actor));
  });

  describe('addActor', () => {
    it('should create a new actor', async () => {
      const createActor: CreateActorInput = { name: 'John Doe',id: 10};
      const newActor: Actor = { id: 1, name: 'John Doe' };
      jest.spyOn(repository, 'create').mockReturnValue(newActor);
      jest.spyOn(repository, 'save').mockResolvedValue(newActor);

      const result = await service.addActor(createActor);

      expect(result).toEqual(newActor);
      expect(repository.create).toHaveBeenCalledWith(createActor);
      expect(repository.save).toHaveBeenCalledWith(newActor);
    });
  });

  describe('findOne', () => {
    it('should find an actor by id', async () => {
      const id = 1;
      const actor: Actor = { id: 1, name: 'John Doe' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(actor);

      const result = await service.findOne(id);

      expect(result).toEqual(actor);
      expect(repository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['cast'],
      });
    });
  });

  describe('findAll', () => {
    it('should find all actors', async () => {
      const actors: Actor[] = [{ id: 1, name: 'John Doe' }, { id: 2, name: 'Jane Smith' }];
      jest.spyOn(repository, 'find').mockResolvedValue(actors);

      const result = await service.findAll();

      expect(result).toEqual(actors);
      expect(repository.find).toHaveBeenCalledWith({ relations: ['cast'] });
    });
  });
});