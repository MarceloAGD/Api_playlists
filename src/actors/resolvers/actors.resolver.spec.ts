import { Test, TestingModule } from '@nestjs/testing';
import { ActorsResolver } from './actors.resolver';
import { ActorsService } from '../services/actors.service';
import { Actor } from '../entities/actor.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('ActorsResolver', () => {
  let resolver: ActorsResolver;
  let service: ActorsService;

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
      providers: [ActorsResolver, 
        {provide: ActorsService,
        useValue: {
          findAll: jest.fn(),
          findOne: jest.fn(),
        }}],
    }).compile();

    resolver = module.get<ActorsResolver>(ActorsResolver);
    service = module.get<ActorsService>(ActorsService);
  });

  describe('Actors', () => {
    it('should return an array of actors', async () => {
      const actors: Actor[] = [
        { id: 1, name: 'John Doe' },
        { id: 2, name: 'Jane Smith' },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(actors);

      const result = await resolver.Actors();

      expect(result).toEqual(actors);
      expect(service.findAll).toHaveBeenCalled();
    });
  });
  describe('Actor', () => {
    it('should return an actor by id', async () => {
      const actor: Actor = { id: 1, name: 'John Doe' };
      jest.spyOn(service, 'findOne').mockResolvedValue(actor);

      const result = await resolver.Actor(1);

      expect(result).toEqual(actor);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });
});