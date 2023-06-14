import { Args, Mutation, Resolver,Query, ResolveField, Parent } from '@nestjs/graphql';
import { PlaylistsService } from '../services/playlists.service';
import { CreatePlaylistInput } from '../dto/create-playlist.input';
import * as update from '../dto/update-playlist.input';
import { Playlist } from '../entities/playlist.entity';
import { Users } from '../../users/entities/users.entity';
import { deletePlaylistInput } from '../dto/delete-playlist.input';


@Resolver(() => Playlist)
export class PlaylistsResolver {
    constructor(private playlistService: PlaylistsService){}
        
    @Mutation((returns) => Playlist)
    createPlaylist(@Args('playlistInput') playlistInput: CreatePlaylistInput){
        return this.playlistService.createPlaylist(playlistInput);
    }

    @Mutation((returns) => Playlist)
    addMoviePlaylist(@Args('playlistInput') playlistInput: update.MoviePlaylistInput){
        return this.playlistService.addMoviePlaylist(playlistInput);
    }

    @Query(() => [Playlist])
    Playlists() {
        return this.playlistService.findAll();
    }

    @Query((returns) => [Playlist])
    Playlist(@Args('userId') userId: number){
        return this.playlistService.getPlaylistByUser(userId);
    }

    @ResolveField(() => Users)
    user(@Parent() playlist: Playlist): Promise<Users>{
        return this.playlistService.getUser(playlist.usersId)
    }

    @Mutation(returns => Boolean)
    removeMoviePlaylist(@Args('playlistInput') playlistInput: update.MoviePlaylistInput): Promise<boolean>{
        return this.playlistService.removeMoviePlaylist(playlistInput);
    }

    @Mutation(returns => Boolean)
    deletePlaylist(@Args('playlistInput') playlistInput: deletePlaylistInput): Promise<boolean>{
        return this.playlistService.deletePlaylist(playlistInput);
    }

    @Mutation(returns => Boolean)
    updatePlaylist(@Args('playlistInput') playlistInput: update.updatePlaylistInput): Promise<boolean>{
        return this.playlistService.updatePlaylist(playlistInput);
    }
}
