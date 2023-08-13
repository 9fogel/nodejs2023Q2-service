export interface IUser {
  id: string; // uuid v4
  login: string;
  password: string;
  version: number; // integer number, increments on update
  createdAt: number | Date; // timestamp of creation
  updatedAt: number | Date; // timestamp of last update
}

export interface IArtist {
  id: string; // uuid v4
  name: string;
  grammy: boolean;
}

export interface ITrack {
  id: string; // uuid v4
  name: string;
  artistId: string | null; // refers to Artist
  albumId: string | null; // refers to Album
  duration: number; // integer number
}

export interface IAlbum {
  id: string; // uuid v4
  name: string;
  year: number;
  artistId: string | null; // refers to Artist
}

export interface IFavorites {
  artists: Array<string>;
  albums: Array<string>;
  tracks: Array<string>;
}

export interface IFavoritesResponse {
  artists: Array<IArtist>;
  albums: Array<IAlbum>;
  tracks: Array<ITrack>;
}
