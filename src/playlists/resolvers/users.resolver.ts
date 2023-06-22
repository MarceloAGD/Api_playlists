import { Resolver, ResolveField, Parent } from '@nestjs/graphql';
import { Users } from '../entities/users.entity';
import { Playlist } from '../entities/playlist.entity';
import { PlaylistsService } from '../services/playlists.service';

@Resolver(()=> Users)
export class UsersResolver {
  constructor(private readonly playlistService: PlaylistsService) {}

  @ResolveField(() => [Playlist])
  playlists(@Parent() user: Users): Promise<Playlist[]>{
    return this.playlistService.forUsers(user.id);
  }
}
