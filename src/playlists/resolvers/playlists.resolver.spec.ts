import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsResolver } from './playlists.resolver';
import { PlaylistsService } from '../services/playlists.service';
import { CreatePlaylistInput } from '../dto/create-playlist.input';
import * as update from '../dto/update-playlist.input';
import { Playlist } from '../entities/playlist.entity';
import { Users } from '../../users/entities/users.entity';
import { deletePlaylistInput } from '../dto/delete-playlist.input';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('PlaylistsResolver', () => {
  let resolver: PlaylistsResolver;
  let service: PlaylistsService;

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
        PlaylistsResolver,
        {
          provide: PlaylistsService,
          useValue: {
            createPlaylist: jest.fn(),
            addMoviePlaylist: jest.fn(),
            findAll: jest.fn(),
            getPlaylistByUser: jest.fn(),
            getUser: jest.fn(),
            removeMoviePlaylist: jest.fn(),
            deletePlaylist: jest.fn(),
            updatePlaylist: jest.fn(),
          },
        },
      ],
    }).compile();

    resolver = module.get<PlaylistsResolver>(PlaylistsResolver);
    service = module.get<PlaylistsService>(PlaylistsService);
  });

  describe('createPlaylist', () => {
    it('should call the service method with the correct input', async () => {
      const playlistInput: CreatePlaylistInput = {
        name: 'Test Playlist',
        usersId: 1,
      };
      const playlist: Playlist = {
        idPlaylist: 1,
        name: 'Test Playlist',
        usersId: 1,
        users: {
          id: 1,
          email: 'test@email.com',
          name: 'Name',
          password: '1234',
          playlists: [],
        },
        movies: [],
      };
      jest.spyOn(service, 'createPlaylist').mockResolvedValue(playlist);

      const result = await resolver.createPlaylist(playlistInput);

      expect(service.createPlaylist).toHaveBeenCalledWith(playlistInput);
      expect(result).toEqual(playlist);
    });
  });

  describe('addMoviePlaylist', () => {
    it('should call the service method with the correct input', async () => {
      const playlistInput: update.MoviePlaylistInput = {
        idPlaylist: 1,
        id: 1,
      };
      const playlist: Playlist = {
        idPlaylist: 1,
        name: 'Test Playlist',
        movies: [
          {
            id: 1,
            title: 'Test Movie',
            poster_path: '',
            overview: '',
            cast: [],
            playlists: [],
          },
        ],
        usersId: 1,
        users: {
          id: 1,
          email: 'test@email.com',
          name: 'Name',
          password: '1234',
          playlists: [],
        },
      };
      jest.spyOn(service, 'addMoviePlaylist').mockResolvedValue(playlist);

      const result = await resolver.addMoviePlaylist(playlistInput);

      expect(service.addMoviePlaylist).toHaveBeenCalledWith(playlistInput);
      expect(result).toEqual(playlist);
    });
  });

  describe('Playlists', () => {
    it('should call the service method and return the result', async () => {
      const movie = {
        id: 1,
        title: 'Test Movie',
        poster_path: '',
        overview: '',
        cast: [],
        playlists: [],
      };
      const user = {
        id: 1,
        email: 'test@email.com',
        name: 'Name',
        password: '1234',
        playlists: [],
      };
      const playlists: Playlist[] = [
        {
          idPlaylist: 1,
          name: 'Test Playlist',
          usersId: user.id,
          users: user,
          movies: [],
        },
        {
          idPlaylist: 2,
          name: 'Test Playlist 2',
          usersId: user.id,
          users: user,
          movies: [movie],
        },
      ];
      jest.spyOn(service, 'findAll').mockResolvedValue(playlists);

      const result = await resolver.Playlists();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(playlists);
    });
  });

  describe('Playlist', () => {
    it('should call the service method with the correct input and return the result', async () => {
      const userId = 1;
      const user = {
        id: userId,
        email: 'test@email.com',
        name: 'Name',
        password: '1234',
        playlists: [],
      };
      const playlists: Playlist[] = [
        {
          idPlaylist: 1,
          name: 'Test Playlist',
          usersId: userId,
          users: user,
          movies: [],
        },
      ];
      jest.spyOn(service, 'getPlaylistByUser').mockResolvedValue(playlists);

      const result = await resolver.Playlist(userId);

      expect(service.getPlaylistByUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(playlists);
    });
  });

  describe('user', () => {
    it('should call the service method with the correct input and return the result', async () => {
      const user: Users = {
        id: 1,
        name: 'Test User',
        email: 'email@email.com',
        password: '1234',
        playlists: [],
      };
      const playlist: Playlist = {
        idPlaylist: 1,
        name: 'Test Playlist',
        usersId: 1,
        movies: [],
        users: user,
      };

      jest.spyOn(service, 'getUser').mockResolvedValue(user);

      const result = await resolver.user(playlist);

      expect(service.getUser).toHaveBeenCalledWith(playlist.usersId);
      expect(result).toEqual(user);
    });
  });
  describe('removeMoviePlaylist', () => {
    it('should call the service method with the correct input and return the result', async () => {
      const playlistInput: update.MoviePlaylistInput = {
        idPlaylist: 1,
        id: 1,
      };
      jest.spyOn(service, 'removeMoviePlaylist').mockResolvedValue(true);

      const result = await resolver.removeMoviePlaylist(playlistInput);

      expect(service.removeMoviePlaylist).toHaveBeenCalledWith(playlistInput);
      expect(result).toBe(true);
    });
  });

  describe('deletePlaylist', () => {
    it('should call the service method with the correct input and return the result', async () => {
      const playlistInput: deletePlaylistInput = { idPlaylist: 1, idUser: 1 };
      jest.spyOn(service, 'deletePlaylist').mockResolvedValue(true);

      const result = await resolver.deletePlaylist(playlistInput);

      expect(service.deletePlaylist).toHaveBeenCalledWith(playlistInput);
      expect(result).toBe(true);
    });
  });

  describe('updatePlaylist', () => {
    it('should call the service method with the correct input and return the result', async () => {
      const playlistInput: update.updatePlaylistInput = {
        idPlaylist: 1,
        name: 'New Name',
      };
      jest.spyOn(service, 'updatePlaylist').mockResolvedValue(true);

      const result = await resolver.updatePlaylist(playlistInput);

      expect(service.updatePlaylist).toHaveBeenCalledWith(playlistInput);
      expect(result).toBe(true);
    });
  });
});
