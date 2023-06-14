import { Entity, Column, PrimaryColumn, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { ObjectType, Field, Int} from '@nestjs/graphql';
import { Actor } from '../../actors/entities/actor.entity';
import { Movie } from '../../movies/entities/movie.entity';

@Entity()
@ObjectType()
export class Cast{

    @PrimaryGeneratedColumn()
    @Field((type) => Int)
    idCast: number;

    @Column()
    @Field((type) => Int, {nullable: true})
    cast_id: number;

    @Column()
    @Field({nullable: true})
    character: string;

    @Column()
    @Field((type) => Int, {nullable: true})
    idActor: number;

    @Column()
    @Field({nullable: true})
    nameActor: string;

    @ManyToOne(() => Actor, actor => actor.cast)
    @Field(() => Actor, {nullable:true})
    actor: Actor;

    @ManyToOne(() => Movie, movie => movie.cast)
    @Field(() => Movie,{nullable:true})
    movie: Movie;

}