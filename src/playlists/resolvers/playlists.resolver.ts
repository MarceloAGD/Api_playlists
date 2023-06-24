import { Args, Mutation, Resolver,Query, ResolveField, Parent, ResolveReference } from '@nestjs/graphql';
import { PlaylistsService } from '../services/playlists.service';
import { CreatePlaylistInput } from '../dto/create-playlist.input';
import * as update from '../dto/update-playlist.input';
import { Playlist } from '../entities/playlist.entity';
import { Users } from '../entities/users.entity';
import { deletePlaylistInput } from '../dto/delete-playlist.input';
import { Movie } from '../entities/movie.entity';


@Resolver(() => Playlist)
export class PlaylistsResolver {
    constructor(private playlistService: PlaylistsService){}
        
    @Mutation((returns) => Playlist)
    createPlaylist(@Args('playlistInput') playlistInput: CreatePlaylistInput){
        return this.playlistService.createPlaylist(playlistInput);
    }

    @Query(() => [Playlist])
    Playlists() {
        return this.playlistService.findAll();
    } 

    @Query((returns) => [Playlist])
    Playlist(@Args('userId') userId: number){
        return this.playlistService.getPlaylistByUser(userId);
    }

    @ResolveField((of) => Users)
    user(@Parent() playlist: Playlist){
        return { __typename:"Users", id: playlist.usersId}
    }/*
    @ResolveField((of) => [Movie])
    movies(@Parent() playlists: Playlist){
        const {idPlaylist} = playlists;
        return this.playlistService.findMovies(idPlaylist);
    }
*/
    @Mutation(returns => Boolean)
    deletePlaylist(@Args('playlistInput') playlistInput: deletePlaylistInput): Promise<boolean>{
        return this.playlistService.deletePlaylist(playlistInput);
    }

    @Mutation(returns => Boolean)
    updatePlaylist(@Args('playlistInput') playlistInput: update.updatePlaylistInput): Promise<boolean>{
        return this.playlistService.updatePlaylist(playlistInput);
    }

    @Mutation((returns) => Playlist)
    addMoviePlaylist(@Args('playlistInput') playlistInput: update.MoviePlaylistInput){
        return this.playlistService.addMoviePlaylist(playlistInput);
    }

    @Mutation(returns => Boolean)
    removeMoviePlaylist(@Args('playlistInput') playlistInput: update.MoviePlaylistInput): Promise<boolean>{
        return this.playlistService.removeMoviePlaylist(playlistInput);
    }

    @ResolveReference()
    resolvereference(ref: {__typename: string, id: number}){
        return this.playlistService.findOne(ref.id);
    }
    
}
