import { Test, TestingModule } from '@nestjs/testing';
import { MoviesService } from './movies.service';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Movie } from '../entities/movie.entity';
import { Actor } from '../../actors/entities/actor.entity';
import { Cast } from '../../casts/entities/cast.entity';
import { ActorsService } from '../../actors/services/actors.service';
import { Repository } from 'typeorm';
import { CreateNovieInput } from '../dto/create-movie.input';
import { CreateActorInput } from '../../actors/dto/create-actor.input';
import axios from 'axios';

describe('MoviesService', () => {
  let service: MoviesService;
  let movieRepository: Repository<Movie>;
  let actorsRepository: Repository<Actor>;
  let castsRepository: Repository<Cast>;
  let actorsService: ActorsService;

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
        MoviesService,
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Actor),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Cast),
          useClass: Repository,
        },
        {
          provide: ActorsService,
          useClass: ActorsService,
        },
      ],
    }).compile();

    service = module.get<MoviesService>(MoviesService);
    movieRepository = module.get<Repository<Movie>>(getRepositoryToken(Movie));
    actorsRepository = module.get<Repository<Actor>>(getRepositoryToken(Actor));
    castsRepository = module.get<Repository<Cast>>(getRepositoryToken(Cast));
    actorsService = module.get<ActorsService>(ActorsService);
  });

  describe('findAll', () => {
    it('should return an array of movies', async () => {
      const movies: Movie[] = [
        { id: 1,
          title: 'Test Movie1',
          poster_path: '',
          overview: '',
          cast: [],
          playlists: [],},
        { id: 2,
          title: 'Test Movie2',
          poster_path: '',
          overview: '',
          cast: [],
          playlists: [],},
      ];
      jest.spyOn(movieRepository, 'find').mockResolvedValue(movies);

      const result = await service.findAll();

      expect(result).toEqual(movies);
    });
  });

  describe('findOne', () => {
    it('should return a movie by id', async () => {
      const movie: Movie = { id: 1, title: 'Movie 1', poster_path: '', overview: '', cast: [], playlists: []};
      jest.spyOn(movieRepository, 'findOne').mockResolvedValue(movie);

      const result = await service.findOne(1);

      expect(result).toEqual(movie);
    });
  });
  describe('getDetailMovie', () => {
    it('should return movie details', async () => {
      const movieId = 1;
      const movieDetails = { id: movieId, title: 'Movie 1' };
      jest.spyOn(axios, 'get').mockResolvedValue({ data: movieDetails });

      const result = await service.getDetailMovie(movieId);

      expect(result).toEqual(movieDetails);
    });
  });

  describe('getCreditMovie', () => {
    it('should return movie credits', async () => {
      const movieId = 1;
      const movieCredits = { cast: [{ id: 1, name: 'Actor 1' }] };
      jest.spyOn(axios, 'get').mockResolvedValue({ data: movieCredits });

      const result = await service.getCreditMovie(movieId);

      expect(result).toEqual(movieCredits);
    });
  });


  describe('insertMovie', () => {
    it('should insert a new movie', async () => {
      const movie: CreateNovieInput = { id: 1, title: 'Movie 1', poster_path: '', overview: ''};
      const newMovie: Movie = { id: 1, title: 'Movie 1', poster_path: '', overview: '', cast: [], playlists: [] };
      jest.spyOn(movieRepository, 'save').mockResolvedValue(newMovie);

      const result = await service.insertMovie(movie);

      expect(result).toEqual(newMovie);
    });
  });
  
  describe('addActorCast', () => {
    it('should add a new cast', async () => {
      const idActor = 1;
      const id = 1;
      const character = 'Character 1';
      const castId = 1;
      const actor: Actor = { id: idActor, name: 'Actor 1', cast: []};
      const movie: Movie = { id: id, title: 'Movie 1', poster_path: '', overview: '', cast: [], playlists: []};
      const newCast: Cast = {
        idCast: 1,
        actor: actor,
        movie: movie,
        cast_id: castId,
        character: character,
        idActor: idActor,
        nameActor: actor.name
      };
      jest.spyOn(actorsService, 'findOne').mockResolvedValue(actor);
      jest.spyOn(service, 'findOne').mockResolvedValue(movie);
      jest.spyOn(castsRepository, 'save').mockResolvedValue(newCast);
  
      const result = await service.addActorCast(idActor, id, character, castId);
  
      expect(actorsService.findOne).toHaveBeenCalledWith(idActor);
      expect(service.findOne).toHaveBeenCalledWith(id);
      expect(castsRepository.save).toHaveBeenCalledWith(result);
      expect(result).toBeTruthy();
      expect(result.actor).toEqual(actor);
    });
  });
});