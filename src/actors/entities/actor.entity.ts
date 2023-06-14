import { Entity, Column, PrimaryColumn, OneToMany} from 'typeorm';
import { ObjectType, Field, Int} from '@nestjs/graphql';
import { Cast } from '../../casts/entities/cast.entity';

@Entity()
@ObjectType()
export class Actor{

    @PrimaryColumn()
    @Field((type) => Int, {nullable:true})
    id: number;

    @Column()
    @Field({nullable: true})
    name: string;

    @OneToMany(() => Cast, cast => cast.actor)
    @Field(() => [Cast],{nullable: true})
    cast?: Cast[];

}