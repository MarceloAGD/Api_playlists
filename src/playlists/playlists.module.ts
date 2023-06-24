import { Module } from '@nestjs/common';
import { PlaylistsService } from './services/playlists.service';
import { PlaylistsResolver } from './resolvers/playlists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Playlist} from './entities/playlist.entity';
import { UsersResolver } from './resolvers/users.resolver';
import { MoviesResolver } from './resolvers/movies.resolver';
import { Movie } from './entities/movie.entity';

@Module({
  imports:[TypeOrmModule.forFeature([Playlist, Movie])],
  providers: [PlaylistsService, PlaylistsResolver, UsersResolver, MoviesResolver],
  exports: [PlaylistsService]
})
export class PlaylistsModule {}
