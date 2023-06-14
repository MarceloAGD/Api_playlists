import { Entity, Column, PrimaryColumn, ManyToMany, OneToMany} from 'typeorm';
import { ObjectType, Field, Int} from '@nestjs/graphql';
import { Playlist } from '../../playlists/entities/playlist.entity';
import { Cast } from '../../casts/entities/cast.entity';

@Entity()
@ObjectType()
export class Movie{

    @PrimaryColumn({type: 'int'})
    @Field((type) => Int)
    id: number;

    @Column()
    @Field()
    title: string;

    @Column()
    @Field({nullable: true})
    poster_path: string;

    @Column()
    @Field({nullable: true})
    overview: string;

    @ManyToMany(() => Playlist, playlist => playlist.movies)
    @Field(() => [Playlist])
    playlists: Playlist[];

    @OneToMany(() => Cast, cast => cast.movie)
    @Field(() => [Cast],{nullable: true})
    cast: Cast[];

}