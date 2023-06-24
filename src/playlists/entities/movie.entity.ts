import { ObjectType, Field, Int, Directive} from '@nestjs/graphql';
import { Entity, ManyToMany, PrimaryColumn } from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity()
@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Movie{

    @PrimaryColumn()
    @Field((type) => Int)
    @Directive('@external')
    id: number;

    @ManyToMany(() => Playlist, playlist => playlist.movies)
    @Field(() => [Playlist])
    playlists: Playlist[];
    
}