import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cast } from '../entities/cast.entity';
import { CastsService } from './casts.service';

describe('CastsService', () => {
  let service: CastsService;
  let repository: Repository<Cast>;

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
        CastsService,
        {
          provide: getRepositoryToken(Cast),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<CastsService>(CastsService);
    repository = module.get<Repository<Cast>>(getRepositoryToken(Cast));
  });

  describe('findAll', () => {
    it('should return an array of Casts', async () => {
      const cast1 = new Cast();
      cast1.idCast = 1;
      cast1.nameActor = 'John Doe';
      cast1.movie = { id: 1,
        title: 'Test Movie1',
        poster_path: '',
        overview: '',
        cast: [],
        playlists: []};
      cast1.actor = { id: 1 , name: 'John Doe' };

      const cast2 = new Cast();
      cast2.idCast = 2;
      cast2.nameActor = 'Jane Smith';
      cast2.movie = { id: 2,
        title: 'Test Movie2',
        poster_path: '',
        overview: '',
        cast: [],
        playlists: []};
      cast2.actor = { id: 2 , name: 'Jane Smith'};

      jest.spyOn(repository, 'find').mockResolvedValue([cast1, cast2]);

      const result = await service.findAll();

      expect(result).toEqual([cast1, cast2]);
    });
  });

  describe('findOne', () => {
    it('should return a Cast with the given movie ID', async () => {
      const casts: Cast[] = [
        {
          idCast: 1,
          nameActor: 'John Doe',
          idActor: 1,
          cast_id: 1,
          character: 'principal',
          movie: {
            id: 1,
            title: 'Test Movie1',
            poster_path: '',
            overview: '',
            cast: [],
            playlists: [],
          },
          actor: { id: 1, name: 'John Doe' },
        },
        {
          idCast: 2,
          nameActor: 'Jane Smith',
          idActor: 2,
          cast_id: 2,
          character: 'secundario',
          movie: {
            id: 1,
            title: 'Test Movie1',
            poster_path: '',
            overview: '',
            cast: [],
            playlists: [],
          },
          actor: { id: 1, name: 'John Doe' },
        },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(casts);

      const result = await service.findOne(1);

      expect(result).toEqual(casts);
    });
  });
});