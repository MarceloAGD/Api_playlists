import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersResolver } from './users.resolver';
import { Users } from '../entities/users.entity';
import { Playlist } from '../entities/playlist.entity';
import { PlaylistsService } from '../services/playlists.service';
import { Movie } from '../entities/movie.entity';

describe('UsersResolver', () => {
  let resolver: UsersResolver;
  let playlistService: PlaylistsService;
  let usersRepository: Repository<Users>;
  let playlistsRepository: Repository<Playlist>;
  let movieRepository: Repository<Movie>

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'sqlite',
          database: ':memory:',
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: true,
        }),
      ],
      providers: [
        UsersResolver,
        PlaylistsService,
        {
          provide: getRepositoryToken(Users),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Playlist),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Movie),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<UsersResolver>(UsersResolver);
    playlistService = module.get<PlaylistsService>(PlaylistsService);
    usersRepository = module.get<Repository<Users>>(getRepositoryToken(Users));
    playlistsRepository = module.get<Repository<Playlist>>(
      getRepositoryToken(Playlist),
    );
  });

  describe('playlists', () => {
    it('should return an array of playlists for a given user', async () => {
      const user = new Users();
      user.id = 1;
      const playlist1 = new Playlist();
      playlist1.idPlaylist = 1;
      playlist1.usersId = 1;
      const playlist2 = new Playlist();
      playlist2.idPlaylist = 2;
      playlist2.usersId = 1;
      jest
        .spyOn(playlistService, 'forUsers')
        .mockResolvedValue([playlist1, playlist2]);

      const result = await resolver.playlists(user);

      expect(result).toEqual([playlist1, playlist2]);
      expect(playlistService.forUsers).toHaveBeenCalledWith(1);
    });
  });
});
