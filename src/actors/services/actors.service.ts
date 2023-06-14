import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Actor } from '../entities/actor.entity';
import { CreateActorInput } from '../dto/create-actor.input';

@Injectable()
export class ActorsService {
    constructor(
        @InjectRepository(Actor)
        private actorsRepository: Repository<Actor>,
        ){}
    
    async addActor(createActor: CreateActorInput): Promise<Actor>{
        const newActor = this.actorsRepository.create(createActor)

        return this.actorsRepository.save(newActor)
    }
    
    async findOne(id: number): Promise<Actor>{
        return this.actorsRepository.findOne({
          where: {
            id,
          },relations:['cast']
        });
      }
    async findAll(): Promise<Actor[]> {
        return this.actorsRepository.find({relations:['cast']});
    }
}
