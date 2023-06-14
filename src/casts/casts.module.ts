import { Module, forwardRef } from '@nestjs/common';
import { CastsService } from './services/casts.service';
import { CastsResolver } from './resolvers/casts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cast } from './entities/cast.entity';
import { MoviesModule } from 'src/movies/movies.module';
import { ActorsModule } from 'src/actors/actors.module';

@Module({
  imports: [TypeOrmModule.forFeature([Cast]), forwardRef(() =>MoviesModule), forwardRef(() =>ActorsModule)],
  providers: [CastsService, CastsResolver],
  exports: [CastsService]
})
export class CastsModule {}
