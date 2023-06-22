import { Module } from '@nestjs/common';
import { PlaylistsService } from './services/playlists.service';
import { PlaylistsResolver } from './resolvers/playlists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Playlist} from './entities/playlist.entity';
import { MoviesResolver } from './resolvers/movies.resolver';
import { UsersResolver } from './resolvers/users.resolver';

@Module({
  imports:[TypeOrmModule.forFeature([Playlist])],
  providers: [PlaylistsService, PlaylistsResolver, MoviesResolver, UsersResolver],
  exports: [PlaylistsService]
})
export class PlaylistsModule {}
