import { Module, forwardRef} from '@nestjs/common';
import { MoviesService } from './services/movies.service';
import { MoviesResolver } from './resolvers/movies.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { ActorsModule } from 'src/actors/actors.module';
import { CastsModule } from 'src/casts/casts.module';
import { Cast } from 'src/casts/entities/cast.entity';
import { Actor } from 'src/actors/entities/actor.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Movie, Cast, Actor]), ActorsModule, forwardRef(() => CastsModule)],
  providers: [MoviesService, MoviesResolver],
  exports: [MoviesService],
})
export class MoviesModule {}