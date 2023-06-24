import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { ObjectType, Field, Int, Directive} from '@nestjs/graphql';
import { Users } from './users.entity';
import { Movie } from './movie.entity';

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

    @Column({type: "int"})
    @Field(() => Int)
    usersId: number;

    @Field(() => Users)
    users?: Users;
    
    @ManyToMany(() => Movie, movie => movie.playlists)
    @JoinTable()
    @Field(() => [Movie])
    movies: Movie[];
}