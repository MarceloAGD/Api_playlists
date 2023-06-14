import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Movie } from '../entities/movie.entity';
import * as fs from 'fs';
import * as path from 'path';
import { CreateNovieInput } from '../dto/create-movie.input';
import { ActorsService } from '../../actors/services/actors.service';
import axios from 'axios';
import { Cast } from '../../casts/entities/cast.entity';

@Injectable()
export class MoviesService {
  constructor(
    @InjectRepository(Movie)
    private movieRepository: Repository<Movie>,
    @InjectRepository(Cast)
    private castsRepository: Repository<Cast>,
    private actorsService: ActorsService,

  ) {}

  async findAll(): Promise<Movie[]> {
    return this.movieRepository.find();
  }

  async findOne(id: number): Promise<Movie> {
    return this.movieRepository.findOne({
      where: {
        id,
      },
    });
  }

  private readonly apiKey = 'af1dbaa6b5d12e6c57238078125686d4';

  async getDetailMovie(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}?api_key=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }

  async getCreditMovie(id: number) {
    const url = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${this.apiKey}`;
    const response = await axios.get(url);
    return response.data;
  }

  async insertMovie(createMovieInput: CreateNovieInput): Promise<Movie> {
    const newMovie = new Movie();
    newMovie.id = createMovieInput.id;
    newMovie.poster_path = createMovieInput.poster_path || '';
    newMovie.overview = createMovieInput.overview || '';
    newMovie.title = createMovieInput.title;

    return this.movieRepository.save(newMovie);
  }

  async addActorCast(
    idActor: number,
    id: number,
    character: string,
    cast_id: number,
  ): Promise<Cast> {
    const actor = await this.actorsService.findOne(idActor);
    const movie = await this.findOne(id);

    const cast = new Cast();
    cast.actor = actor;
    cast.movie = movie;
    cast.cast_id = cast_id;
    cast.character = character;
    cast.idActor = idActor;
    cast.nameActor = actor.name;
    await this.castsRepository.save(cast);

    return cast;
  }
  async loadMovieJSON(): Promise<boolean> {
    try {
      const data = fs.readFileSync(
        path.resolve('src/json/movie_ids_05_15_2023.json'),
        'utf-8',
      );
      const movies: Movie[] = JSON.parse(data);
      for (const movie of movies) {
        const movieExist = await this.findOne(movie.id);

        if (!movieExist) {
          const movieData = await this.getDetailMovie(movie.id);
          const creditData = await this.getCreditMovie(movie.id);
          await this.insertMovie(movieData);
          const castData = creditData.cast;

          for (const data of castData) {
            await this.actorsService.addActor(data);
            await this.addActorCast(
              data.id,
              movie.id,
              data.character,
              data.cast_id,
            );
          }
        }
      }
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
