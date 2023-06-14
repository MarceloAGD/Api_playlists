import { Entity, Column, PrimaryGeneratedColumn , Unique, OneToMany } from 'typeorm';
import { ObjectType, Field, Int} from '@nestjs/graphql';
import { Playlist } from '../../playlists/entities/playlist.entity';

@Entity()
@ObjectType()
export class Users{
    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    id: number;
    
    @Column()
    @Unique(["email"]) // Indica que el campo debe ser único en la columna "email"
    @Field()
    email: string;
    
    @Column()
    @Field()
    name: string;
    
    @Column()
    @Field()
    password: string;

    @OneToMany(() => Playlist, (playlist) => playlist.users)
    @Field(() => [Playlist], {nullable: true})
    playlists: Playlist[];
}
    

