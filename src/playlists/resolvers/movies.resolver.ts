import { Parent, ResolveField, Resolver } from '@nestjs/graphql';
import { PlaylistsService } from '../services/playlists.service';
import { Playlist } from '../entities/playlist.entity';
import { Movie } from '../entities/movie.entity';


@Resolver((of) => Movie)
export class MoviesResolver {
    constructor(private readonly playlistService: PlaylistsService) {}

  @ResolveField(() => [Playlist])
  playlists(@Parent() movie: Movie): Promise<Playlist[]>{
    return this.playlistService.forMovies(movie.id);
  }
}
