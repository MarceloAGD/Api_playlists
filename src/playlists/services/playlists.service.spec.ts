import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PlaylistsService } from './playlists.service';
import { Playlist } from '../entities/playlist.entity';
import { CreatePlaylistInput } from '../dto/create-playlist.input';
import { Users } from 'src/playlists/entities/users.entity';
import { Movie } from '../entities/movie.entity';


describe('PlaylistsService', () => {
  let service: PlaylistsService;
  let playlistsRepository: Repository<Playlist>;
  let movieRepository: Repository<Movie>;

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
        PlaylistsService,
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

    service = module.get<PlaylistsService>(PlaylistsService);
    playlistsRepository = module.get<Repository<Playlist>>(
      getRepositoryToken(Playlist),
    );
  });

  describe('findAll', () => {
    it('should return an array of playlists', async () => {
      const playlists: Playlist[] = [
        {
          idPlaylist: 1,
          name: 'Test Playlist 1',
          usersId: 1,
          users: {
            id: 1,
          },
          movies: [],
        },
        {
          idPlaylist: 2,
          name: 'Test Playlist 2',
          usersId: 1,
          users: {
            id: 2,
          },
          movies: [],
        },
      ];
      jest.spyOn(playlistsRepository, 'find').mockResolvedValue(playlists);

      const result = await service.findAll();

      expect(result).toEqual(playlists);
    });
  });

  describe('getPlaylistByUser', () => {
    it('should return an array of playlists for a given user ID', async () => {
      const userId = 1;
      const playlists: Playlist[] = [
        {
          idPlaylist: 1,
          name: 'Test Playlist 1',
          usersId: 1,
          users: {
            id: 1,
          },
          movies: [],
        },
        {
          idPlaylist: 2,
          name: 'Test Playlist 2',
          usersId: 1,
          users: {
            id: 2,
          },
          movies: [],
        },
      ];
      jest.spyOn(playlistsRepository, 'find').mockResolvedValue(playlists);

      const result = await service.getPlaylistByUser(userId);

      expect(result).toEqual(playlists);
    });
  });


  describe('createPlaylist', () => {
    it('should create a new playlist', async () => {
      const playlist: CreatePlaylistInput = {
        name: 'Test Playlist',
        usersId: 1,
      };
      const newPlaylist: Playlist = {
        idPlaylist: 1,
        name: playlist.name,
        usersId: playlist.usersId,
        users: {
          id: 1,
        },
        movies: [],
      };
      jest.spyOn(playlistsRepository, 'create').mockReturnValue(newPlaylist);
      jest.spyOn(playlistsRepository, 'save').mockResolvedValue(newPlaylist);

      const result = await service.createPlaylist(playlist);

      expect(result).toEqual(newPlaylist);
    });
  });

  describe('addMoviePlaylist', () => {
    it('should add a movie to a playlist', async () => {
      const idPlaylist = 1;
      const playlist: Playlist = {
        idPlaylist: idPlaylist,
        name: 'Test Playlist 1',
        usersId: 1,
        users: {
          id: 1,
        },
        movies: [],
      };
      const movie = {
        id: 1,
        title: 'Test Movie',
        poster_path: '',
        overview: '',
        cast: [],
        playlists: [],
      };
      jest.spyOn(playlistsRepository, 'findOne').mockResolvedValue(playlist);
      jest.spyOn(playlistsRepository, 'save').mockResolvedValue(playlist);
    });
  });

  describe('removeMoviePlaylist', () => {
    it('should remove a movie from a playlist', async () => {
      const idPlaylist = 1;
      const idMovie = 1;
      const movie: Movie = {
        id: idMovie,
        playlists:[]
      };
      const playlist: Playlist = {
        idPlaylist: idPlaylist,
        name: 'Test Playlist',
        usersId: 1,
        users: {
          id: 1,
        },
        movies: [movie],
      };
      jest.spyOn(playlistsRepository, 'findOne').mockResolvedValue(playlist);
      jest.spyOn(playlistsRepository, 'save').mockResolvedValue(playlist);

      const result = await service.removeMoviePlaylist({
        idPlaylist,
        id: idMovie,
      });

      expect(result).toBeTruthy();
      expect(playlist.movies).not.toContain(movie);
      expect(playlistsRepository.findOne).toHaveBeenCalledWith({
        where: { idPlaylist },
        relations: ['movies'],
      });
      expect(playlistsRepository.save).toHaveBeenCalledWith({
        idPlaylist: idPlaylist,
        name: 'Test Playlist',
        usersId: 1,
        movies: [],
        users: {
          id: 1,
        },
      });
    });
  });

  describe('deletePlaylist', () => {
    it('should delete a playlist for a given user ID', async () => {
      const idPlaylist = 1;
      const idUser = 1;
      const playlist: Playlist = {
        idPlaylist: idPlaylist,
        name: 'Test Playlist',
        usersId: 1,
        users: {
          id: 1,

        },
        movies: [
          {
            id: 1,
            playlists: [],
          },
        ],
      };
      jest.spyOn(playlistsRepository, 'findOne').mockResolvedValue(playlist);
      jest
        .spyOn(playlistsRepository, 'delete')
        .mockResolvedValue({ raw: {}, affected: 1 });

      const result = await service.deletePlaylist({ idPlaylist, idUser });

      expect(result).toBe(true);
      expect(playlistsRepository.findOne).toHaveBeenCalledWith({
        where: { idPlaylist, usersId: idUser },
      });
      expect(playlistsRepository.delete).toHaveBeenCalledWith(playlist);
    });
  });
});
