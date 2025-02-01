import { Album } from './album.entity';

export interface Photo {
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
  albumId: number;
  album?: Album;
}
