import { Test, TestingModule } from '@nestjs/testing';
import { MoviesResolver } from './movies.resolver';
import { MoviesService } from '../services/movies.service';
import { Movie } from '../entities/movie.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('MoviesResolver', () => {
  let resolver: MoviesResolver;
  let service: MoviesService;

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
        MoviesResolver,
        {
          provide: MoviesService,
          useValue: {
            loadMovieJSON: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<MoviesResolver>(MoviesResolver);
    service = module.get<MoviesService>(MoviesService);
  });

  describe('loadData', () => {
    it('should return true', async () => {
      jest.spyOn(service, 'loadMovieJSON').mockResolvedValue(true);
      expect(await resolver.loadData()).toBe(true);
    });
  });

  describe('Movies', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
        {
          id: 1,
          title: 'Test Movie1',
          poster_path: '',
          overview: '',
          cast: [],
          playlists: [],
        },
        {
          id: 2,
          title: 'Test Movie2',
          poster_path: '',
          overview: '',
          cast: [],
          playlists: [],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(movies);
      const result = await resolver.Movies();

      expect(result).toEqual(movies);
    });
  });

  describe('MovieId', () => {
    it('should return a movie by id', async () => {
      const id = 1;
      const movie: Movie = {
        id: id,
        title: 'Movie 1',
        poster_path: '',
        overview: '',
        cast: [],
        playlists: [],
      };
      jest.spyOn(service, 'findOne').mockResolvedValue(movie);
      expect(await resolver.MovieId(id)).toEqual(movie);
    });
  });
});
