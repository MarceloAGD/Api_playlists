import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cast } from '../entities/cast.entity';
import { CastsService } from '../services/casts.service';
import { CastsResolver } from './casts.resolver';

describe('CastsResolver', () => {
  let resolver: CastsResolver;
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
        CastsResolver,
        CastsService,
        {
          provide: getRepositoryToken(Cast),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<CastsResolver>(CastsResolver);
    service = module.get<CastsService>(CastsService);
    repository = module.get<Repository<Cast>>(getRepositoryToken(Cast));
  });

  describe('Casts', () => {
    it('should return an array of Casts', async () => {
      const result: Cast[] = [
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
      jest.spyOn(service, 'findAll').mockResolvedValue(result);

      expect(await resolver.Casts()).toBe(result);
    });
  });

  describe('Cast', () => {
    it('should return an array of Casts for a given movie ID', async () => {
      const idMovie = 1;
      const result: Cast[] = [
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
      ];
      jest.spyOn(service, 'findOne').mockResolvedValue(result);

      expect(await resolver.Cast(idMovie)).toBe(result);
      expect(service.findOne).toHaveBeenCalledWith(idMovie);
    });
  });
});
