import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { ObjectType, Field, Int, Directive} from '@nestjs/graphql';
import {Movie} from './movie.entity';
import { Users } from './users.entity';

@Entity()
@ObjectType()
@Directive('@key(fields: "idPlaylist")')
export class Playlist{

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    idPlaylist: number;

    @Column()
    @Field()
    name: string;

    /*@ManyToMany(() => Movie, movie => movie.playlists)
    @JoinTable({
        name: "playlist_detail"
    })*/
    @Field(() => [Movie])
    movies: Movie[];

    @Column({type: "int"})
    @Field(() => Int)
    usersId: number;

    @Field(() => Users)
    users?: Users;

}