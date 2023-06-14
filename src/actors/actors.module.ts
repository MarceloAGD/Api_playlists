import { Module, forwardRef } from '@nestjs/common';
import { ActorsService } from './services/actors.service';
import { ActorsResolver } from './resolvers/actors.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Actor } from './entities/actor.entity';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports:[TypeOrmModule.forFeature([Actor])],
  providers: [ActorsService, ActorsResolver],
  exports: [ActorsService]
})
export class ActorsModule {}
