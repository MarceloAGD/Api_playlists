import { Entity, Column, PrimaryColumn, ManyToMany, OneToMany} from 'typeorm';
import { ObjectType, Field, Int, Directive} from '@nestjs/graphql';
import { Playlist } from './playlist.entity';

@ObjectType()
@Directive('@extends')
@Directive('@key(fields: "id")')
export class Movie{

    @PrimaryColumn({type: 'int'})
    @Field((type) => Int)
    id: number;

    @Field(() => [Playlist])
    playlists?: Playlist[];

}