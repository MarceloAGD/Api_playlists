import { Module } from '@nestjs/common';
import { PlaylistsService } from './services/playlists.service';
import { PlaylistsResolver } from './resolvers/playlists.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Playlist} from './entities/playlist.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports:[TypeOrmModule.forFeature([Playlist]), MoviesModule, UsersModule],
  providers: [PlaylistsService, PlaylistsResolver],
  exports: [PlaylistsService]
})
export class PlaylistsModule {}
